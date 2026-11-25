import * as JSONC from "jsonc-parser";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as v from "valibot";

const versionSchema = v.pipe(v.string(), v.regex(/^\d+\.\d+\.\d+$/));
const configSchema = v.object({
  version: versionSchema,
  targetVersion: v.optional(versionSchema),
  regolith: v.object({
    dataPath: v.string(),
  }),
});
const settingsSchema = v.strictObject({
  outputFile: v.optional(v.pipe(v.string(), v.minLength(1))),
});

/**
 * @param {string} text
 * @param {string} key
 * @param {string} version
 */
function applyVersion(text, key, version) {
  /** @type {JSONC.JSONPath[]} */
  const paths = [];
  JSONC.visit(text, {
    onArrayBegin: (offset, length, line, char, getPath) => {
      const path = getPath();
      if (path.at(-1) === key) {
        paths.push(path);
      }
    },
  });

  const value = version.split(".").map(Number);
  for (const path of paths) {
    const edits = JSONC.modify(text, path, value, {}).map((edit) => {
      edit.content = edit.content.replaceAll(",", ", ");
      return edit;
    });
    text = JSONC.applyEdits(text, edits);
  }

  return text;
}

async function main() {
  const ROOT_DIR = process.env.ROOT_DIR;
  if (!ROOT_DIR) {
    throw new Error("Failed to get 'ROOT_DIR' env");
  }

  const config = v.safeParse(
    configSchema,
    JSONC.parse(await readFile(join(ROOT_DIR, "config.json"), "utf8")),
  );
  if (!config.success) {
    throw new Error(`config.json: ${v.summarize(config.issues)}`);
  }
  const { version, targetVersion, regolith: { dataPath } } = config.output;

  const settings = v.safeParse(settingsSchema, JSON.parse(process.argv[2] || "{}"));
  if (!settings.success) {
    throw new Error(`filter settings: ${v.summarize(settings.issues)}`);
  }

  /** @param {string} path */
  const modifyManifest = async (path) => {
    if (!existsSync(path)) return;
    let manifest = await readFile(path, "utf8");

    manifest = applyVersion(manifest, "version", version);
    if (targetVersion !== undefined) {
      manifest = applyVersion(manifest, "min_engine_version", targetVersion);
    }
    await writeFile(path, manifest);
  };
  await Promise.all([
    modifyManifest("./BP/manifest.json"),
    modifyManifest("./RP/manifest.json"),
  ]);

  const { outputFile } = settings.output;
  if (outputFile === undefined) return;

  const lines = [`export const VERSION = "${version}";`];
  if (targetVersion !== undefined) {
    lines.push(`export const TARGET_VERSION = "${targetVersion}";`);
  }
  const content = lines.join("\n") + "\n";

  const path = join("./data", outputFile);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);

  const rootPath = join(ROOT_DIR, dataPath, outputFile);
  await mkdir(dirname(rootPath), { recursive: true });
  if (await readFile(rootPath, "utf8").catch(() => "") !== content) {
    await writeFile(rootPath, content);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
