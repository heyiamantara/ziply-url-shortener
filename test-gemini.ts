import "dotenv/config";
import { checkUrlSafety } from "./src/server/actions/urls/check-url-safety.js";

async function test() {
  console.log("Testing Gemini API with a sus URL...");
  const result = await checkUrlSafety("http://ianfette.org/");
  console.log("Result:", JSON.stringify(result, null, 2));
}

test();
