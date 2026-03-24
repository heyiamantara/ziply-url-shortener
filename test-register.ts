import "dotenv/config";
import { registerUser } from "./src/server/actions/auth/register.js";

async function test() {
  const formData = new FormData();
  formData.append("name", "Test User");
  formData.append("email", "test." + Date.now() + "@example.com");
  formData.append("password", "password123");

  try {
    const res = await registerUser(formData);
    console.log("Register response:", res);
  } catch (e) {
    console.error("Register error:", e);
  }
  process.exit(0);
}

test();
