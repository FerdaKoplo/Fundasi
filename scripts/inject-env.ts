import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN_CANISTER_KEY = "CANISTER_ID_ICRC1_LEDGER";
const canisterId = process.env[TOKEN_CANISTER_KEY];

if (!canisterId) {
  console.error(`❌ ${TOKEN_CANISTER_KEY} not found in .env`);
  process.exit(1);
}

const envMoPath = path.join(__dirname, "../src/Fundasi_backend/env.mo");
const content = `module {
  public let TOKEN_CANISTER_ID = "${canisterId}";
}`;

fs.writeFileSync(envMoPath, content);
console.log(`✅ env.mo updated with TOKEN_CANISTER_ID = ${canisterId}`);
