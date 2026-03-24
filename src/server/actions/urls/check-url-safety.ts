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
      "reason": string or null,
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

        return JSON.parse(jsonMatch[0]) as UrlSafetyCheck;
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
    return {
      isSafe: false,
      flagged: true,
      reason: "Potentially deceptive domain format",
      category: "suspicious",
      confidence: 0.7,
    };
  }

  if (patternHit || riskyTldHit) {
    return {
      isSafe: false,
      flagged: true,
      reason: "URL contains common phishing/scam indicators",
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
