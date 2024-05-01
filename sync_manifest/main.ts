import { Config, Manifest } from "./types.ts";
import { readJson, writeJson } from "./utils.ts";

function syncManifest(manifest: Manifest, version?: number[], targetVersion?: number[]) {
  if (version) {
    manifest.header.version = version;
    for (const dependency of manifest.dependencies) {
      if (Array.isArray(dependency.version)) {
        dependency.version = version;
      }
    }
    for (const module of manifest.modules) {
      if (Array.isArray(module.version)) {
        module.version = version;
      }
    }
  }
  if (targetVersion) {
    manifest.header.min_engine_version = targetVersion;
  }
  return manifest;
}

const ROOT_DIR = Deno.env.get("ROOT_DIR");

if (!ROOT_DIR) {
  throw new Error("Failed to get ROOT_DIR");
}

const config = await readJson<Config>(`${ROOT_DIR}/config.json`);

const bpManifest = await readJson<Manifest>("BP/manifest.json");
const rpManifest = await readJson<Manifest>("RP/manifest.json");

const version = config.version?.split(".").map(Number);
const targetVersion = config.targetVersion?.split(".").map(Number);

await Promise.all([
  writeJson("BP/manifest.json", syncManifest(bpManifest, version, targetVersion)),
  writeJson("RP/manifest.json", syncManifest(rpManifest, version, targetVersion)),
]);
