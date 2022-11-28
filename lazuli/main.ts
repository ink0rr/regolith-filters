import { walk } from "https://deno.land/std@0.165.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.165.0/path/mod.ts";
import { AddonFile, lazuli } from "https://deno.land/x/lazuli/mod.ts";

const path = Deno.args[0] ?? "./data/lazuli/export";

const files: AddonFile[] = [];

for await (const entry of walk(path, { includeDirs: false, exts: [".ts"] })) {
  const path = resolve(entry.path);
  const mod = await import(`file://${path}`);
  const file = mod.default;

  if (file instanceof AddonFile) {
    files.push(file);
  }
  if (Array.isArray(file)) {
    files.push(...file.flat().filter((f) => f instanceof AddonFile));
  }
}

await lazuli(files);
