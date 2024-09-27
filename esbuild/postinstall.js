import { randomUUID } from "crypto";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

async function readJson(path) {
  const text = await readFile(path, "utf-8");
  return JSON.parse(text);
}

async function latestVersion(packageName) {
  return fetch(`https://registry.npmjs.org/${packageName}/latest`)
    .then((res) => res.json())
    .then((json) => json.version);
}

async function main() {
  const rootDir = process.env.ROOT_DIR;
  if (!rootDir) {
    return;
  }
  const config = await readJson(join(rootDir, "/config.json"));
  const manifestPath = join(rootDir, config.packs.behaviorPack, "manifest.json");
  const manifest = await readJson(manifestPath);
  if (
    manifest.modules.some((m) => m.type === "script") ||
    manifest.dependencies.some((d) => d.module_name === "@minecraft/server")
  ) {
    return;
  }
  const version = await latestVersion("@minecraft/server").catch(() => "1.0.0");
  manifest.modules.push({
    type: "script",
    uuid: randomUUID(),
    version: [1, 0, 0],
    language: "javascript",
    entry: "scripts/main.js",
  });
  manifest.dependencies.push({
    module_name: "@minecraft/server",
    version,
  });

  const text = JSON.stringify(manifest, null, 2)
    .replace(/(?<=version": )\[[^\]]+\]/g, (v) => `[${JSON.parse(v).join(", ")}]`);
  writeFile(manifestPath, text + "\n");
}

main().catch(() => {}); // ignore errors
