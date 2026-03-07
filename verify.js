/**
 * Verification proof for contract 0xa327075af2a223a1c83a36ada1126afe7430f955
 * EarlyChainLetter10ETH - one of the earliest investment/chain-letter contracts.
 *
 * Compiles MyScheme.sol with soljson v0.1.1+commit.6ff4cd6 (optimizer ON)
 * and compares against on-chain creation bytecode.
 *
 * Usage:
 *   curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
 *   npm install solc
 *   node verify.js
 */

const fs = require("fs");
const path = require("path");

const soljson = require(path.join(__dirname, "soljson-v0.1.1.js"));
const compile = soljson.cwrap("compileJSON", "string", ["string", "number"]);

const onchainHex = fs
  .readFileSync(path.join(__dirname, "onchain-creation.hex"), "utf8")
  .trim()
  .replace(/^0x/, "");

const source = fs.readFileSync(path.join(__dirname, "MyScheme.sol"), "utf8");

// Compile with optimizer ON (1)
const result = JSON.parse(compile(source, 1));

if (result.errors && result.errors.length > 0) {
  console.error("Compilation errors:", result.errors);
  process.exit(1);
}

const compiledHex = result.contracts["MyScheme"].bytecode;

console.log("Compiler: soljson v0.1.1+commit.6ff4cd6");
console.log("Optimizer: ON");
console.log("");
console.log("Compiled creation bytecode:", compiledHex.length / 2, "bytes");
console.log("On-chain creation bytecode:", onchainHex.length / 2, "bytes");
console.log("");

if (compiledHex.toLowerCase() === onchainHex.toLowerCase()) {
  console.log("✅ EXACT MATCH - byte-for-byte identical (" + compiledHex.length / 2 + " bytes)");
  console.log("");
  console.log("Contract:  0xa327075af2a223a1c83a36ada1126afe7430f955");
  console.log("Block:     49,931 (August 8, 2015)");
  console.log("Deployer:  0x881b0A4e9c55d08e31d8d3C022144d75A454211c");
  console.log("Source:    MyScheme.sol");
  console.log("Compiler:  soljson v0.1.1+commit.6ff4cd6");
  console.log("Settings:  optimizer on");
} else {
  console.log("❌ NO MATCH");
  for (let i = 0; i < Math.max(compiledHex.length, onchainHex.length); i++) {
    if ((compiledHex[i] || "").toLowerCase() !== (onchainHex[i] || "").toLowerCase()) {
      console.log("First difference at byte", Math.floor(i / 2));
      console.log("  Compiled:", compiledHex.substring(i, i + 20));
      console.log("  On-chain:", onchainHex.substring(i, i + 20));
      break;
    }
  }
  process.exit(1);
}
