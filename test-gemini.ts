import "dotenv/config";
import { checkUrlSafety } from "./src/server/actions/urls/check-url-safety.js";

async function test() {
  console.log("Testing Gemini API with a sus URL...");
  const URL = "http://verify-your-secure-wallet-login.xyz/claim-bonus";
  const result = await checkUrlSafety(URL);
  console.log("URL:", URL);
  console.log("Result:", JSON.stringify(result, null, 2));
}

test();
