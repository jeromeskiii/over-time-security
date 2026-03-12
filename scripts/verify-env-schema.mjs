#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENV_EXAMPLE_PATH = path.join(ROOT, ".env.example");
const SCAN_DIRS = ["apps", "packages"];

const IGNORED_ENV_KEYS = new Set([
  "NODE_ENV",
]);

const ROOT_DIRS_THAT_MUST_NOT_EXIST = ["app", "components"];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".turbo") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|cjs)$/.test(entry.name)) {
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function getEnvExampleKeys() {
  const text = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8");
  return new Set(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => line.split("=", 1)[0].trim())
      .filter(Boolean),
  );
}

function getUsedEnvKeys() {
  const keys = new Set();
  const pattern = /process\.env\.([A-Z0-9_]+)/g;

  for (const dir of SCAN_DIRS) {
    const scanPath = path.join(ROOT, dir);
    if (!fs.existsSync(scanPath)) continue;
    for (const filePath of walk(scanPath)) {
      const text = fs.readFileSync(filePath, "utf8");
      let match;
      while ((match = pattern.exec(text)) !== null) {
        keys.add(match[1]);
      }
    }
  }

  return keys;
}

function fail(message, details = []) {
  console.error(`\n[env:verify] ${message}`);
  for (const detail of details) {
    console.error(`- ${detail}`);
  }
  process.exit(1);
}

const missingRootDirs = ROOT_DIRS_THAT_MUST_NOT_EXIST.filter((dir) => {
  const fullPath = path.join(ROOT, dir);
  return fs.existsSync(fullPath) && fs.readdirSync(fullPath).length > 0;
});

if (missingRootDirs.length > 0) {
  fail("Unexpected root app folders found. Move code into apps/*/src.", missingRootDirs);
}

const envExampleKeys = getEnvExampleKeys();
const usedEnvKeys = getUsedEnvKeys();

const missingInEnvExample = [...usedEnvKeys]
  .filter((key) => !IGNORED_ENV_KEYS.has(key))
  .filter((key) => !envExampleKeys.has(key))
  .sort();

if (missingInEnvExample.length > 0) {
  fail("Environment keys are used in code but missing from .env.example", missingInEnvExample);
}

console.log("[env:verify] OK - .env.example covers all process.env usage in apps/* and packages/*.");
