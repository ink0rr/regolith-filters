import type { Manifest } from "./types/Manifest.ts";
import type { ProjectConfig } from "./types/ProjectConfig.ts";
import { readJson, writeJson } from "./utils.ts";

function syncManifest(manifest: Manifest, name?: string, version?: number[], targetVersion?: number[]) {
  if (name) {
    manifest.header.name = name;
  }
  if (version) {
    manifest.header.version = version;
    manifest.dependencies[0].version = version;
    manifest.modules[0].version = version;
  }
  if (targetVersion) {
    manifest.header.min_engine_version = targetVersion;
  }
}

const config = await readJson<ProjectConfig>("../../config.json");

const bpManifest = await readJson<Manifest>("BP/manifest.json");
const rpManifest = await readJson<Manifest>("RP/manifest.json");

const version = config.version?.split(".").map(Number);
const targetVersion = config.targetVersion?.split(".").map(Number);

syncManifest(bpManifest, config.name, version, targetVersion);
syncManifest(rpManifest, config.name, version, targetVersion);

await Promise.all([
  writeJson("BP/manifest.json", bpManifest),
  writeJson("RP/manifest.json", rpManifest),
]);
