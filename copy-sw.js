import { copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = resolve(__dirname, "src/public/sw.js");
const destination = resolve(__dirname, "dist/sw.js");

try {
  if (existsSync(source)) {
    copyFileSync(source, destination);
    console.log("✅ Service Worker copied to dist root successfully!");
  } else {
    console.error("❌ Source sw.js not found:", source);
  }
} catch (error) {
  console.error("❌ Failed to copy sw.js:", error);
}
