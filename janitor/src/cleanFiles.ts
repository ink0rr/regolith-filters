import { readJson, writeJson } from "https://deno.land/x/lazuli@0.0.4/mod.ts";
import glob from "npm:tiny-glob";

export async function cleanFiles(pack: "BP" | "RP", dir: string, keys: Set<string>) {
  for (const path of await glob(`${pack}/${dir}/**/*.json`).catch(() => [])) {
    // deno-lint-ignore no-explicit-any
    const data = await readJson<any>(path);
    const prevSize = Object.keys(data[dir]).length;

    for (const key of Object.keys(data[dir])) {
      if (!keys.has(key)) {
        console.log(`Unused key: "${key}" in ${path}`);
        delete data[dir][key];
      }
    }

    if (Object.keys(data[dir]).length === 0) {
      console.log(`Removing empty ${dir} file: ${path}`);
      await Deno.remove(path);
    } else if (Object.keys(data[dir]).length !== prevSize) {
      await writeJson(path, data);
    }
  }
}
