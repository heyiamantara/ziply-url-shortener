"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse } from "@/lib/types";

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
  confidence: number;
};

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"] as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableGeminiError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    const status = (error as { status: number }).status;
    return status === 429 || status === 500 || status === 502 || status === 503;
  }
  return false;
}

async function generateSafetyWithGemini(url: string, apiKey: string) {
  const prompt = `
    Analyze this URL for safety concerns: "${url}"
    
    Consider the following aspects:
    1. Is it a known phishing site?
    2. Does it contain malware or suspicious redirects?
    3. Is it associated with scams or fraud?
    4. Does it contain inappropriate content (adult, violence, etc.)?
    5. Is the domain suspicious or newly registered?
    
    Respond in JSON format with the following structure:
    {
      "isSafe": boolean,
      "flagged": boolean,
      "reason": "A short (3-5 word) summary of the main safety concern or null",
      "detailedAnalysis": "A comprehensive 2-3 sentence explanation of why this URL was flagged, citing specific suspicious characteristics, or null",
      "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
      "confidence": number between 0 and 1
    }
    
    Only respond with the JSON object, no additional text.
  `;

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Failed to parse JSON response");
        }

        const json = JSON.parse(jsonMatch[0]) as {
          isSafe: boolean;
          flagged: boolean;
          reason: string | null;
          detailedAnalysis: string | null;
          category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
          confidence: number;
        };

        const combinedReason = json.flagged && json.reason && json.detailedAnalysis
          ? `${json.reason.trim().replace(/\.$/, "")}. ${json.detailedAnalysis.trim().replace(/\.$/, "")}.`
          : json.reason;

        return {
          ...json,
          reason: combinedReason,
        } as UrlSafetyCheck;
      } catch (error) {
        lastError = error;
        if (attempt === 0 && isRetriableGeminiError(error)) {
          await sleep(400);
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("Gemini safety check failed");
}

function heuristicSafetyCheck(url: string): UrlSafetyCheck {
  const lowerUrl = url.toLowerCase();
  const suspiciousPatterns = [
    "login",
    "verify",
    "secure",
    "wallet",
    "airdrop",
    "gift",
    "free-money",
    "bonus",
    "claim",
    "update-account",
    "password-reset",
  ];

  const riskyTlds = [".zip", ".click", ".top", ".xyz", ".work", ".country"];
  const hasPunycode = lowerUrl.includes("xn--");
  const hasIpHost = /^https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(lowerUrl);
  const patternHit = suspiciousPatterns.some((pattern) =>
    lowerUrl.includes(pattern)
  );
  const riskyTldHit = riskyTlds.some((tld) => {
    try {
      const host = new URL(lowerUrl).hostname;
      return host.endsWith(tld);
    } catch {
      return false;
    }
  });

  if (hasPunycode || hasIpHost) {
    const analysis = hasPunycode 
      ? "This URL uses Punycode (international characters) to impersonate a legitimate brand. This is a common technique used in phishing attacks." 
      : "This URL uses a direct IP address instead of a domain name, which is often used by malicious sites to bypass security filters.";
    return {
      isSafe: false,
      flagged: true,
      reason: `Deceptive domain format. ${analysis}`,
      category: "suspicious",
      confidence: 0.7,
    };
  }

  if (patternHit || riskyTldHit) {
    let specificReason = "URL contains common phishing/scam indicators";
    let analysis = "This URL contains patterns or uses a top-level domain (.click, .zip, etc.) that are frequently associated with phishing, scams, or malicious redirects.";
    
    if (riskyTldHit) {
      const tld = lowerUrl.split('.').pop()?.split('/')[0];
      specificReason = `Deceptive .${tld} domain`;
      analysis = `This URL uses a .${tld} domain, which is considered high-risk and frequently used for deceptive content or malware distribution.`;
    }

    return {
      isSafe: false,
      flagged: true,
      reason: `${specificReason}. ${analysis}`,
      category: "suspicious",
      confidence: 0.65,
    };
  }

  return {
    isSafe: true,
    flagged: false,
    reason: null,
    category: "unknown",
    confidence: 0.4,
  };
}

export async function checkUrlSafety(
  url: string
): Promise<ApiResponse<UrlSafetyCheck>> {
  try {
    try {
      new URL(url);
    } catch {
      return {
        success: false,
        error: "Invalid URL format",
      };
    }

    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.log("Missing Google Gemini API Key, using heuristic check");
      return {
        success: true,
        data: heuristicSafetyCheck(url),
      };
    }

    const jsonResponse = await generateSafetyWithGemini(url, geminiApiKey);
    const heuristicResult = heuristicSafetyCheck(url);

    const finalResult =
      !jsonResponse.flagged && heuristicResult.flagged
        ? {
            ...heuristicResult,
            reason:
              heuristicResult.reason ||
              "Flagged by URL pattern-based safety heuristics",
          }
        : jsonResponse;

    return {
      success: true,
      data: finalResult,
    };
  } catch (error) {
    console.error("Gemini safety check failed, using heuristic fallback", error);
    return {
      success: true,
      data: heuristicSafetyCheck(url),
    };
  }
}
