import { EntityBehavior, readJson, writeJson } from "https://deno.land/x/lazuli@0.0.4/mod.ts";
import glob from "npm:tiny-glob";
import { getKeys } from "./getKeys.ts";
import { cleanFiles } from "./cleanFiles.ts";

export async function checkBP() {
  const keys = new Set<string>();

  for (const path of await glob("BP/entities/**/*.json").catch(() => [])) {
    const data = await readJson<EntityBehavior>(path);
    const bp = data["minecraft:entity"];
    getKeys(bp.description, keys);

    if (!bp.component_groups) continue;

    let changed = false;
    const events = JSON.stringify(bp.events);
    for (const key of Object.keys(bp.component_groups)) {
      // Not sure how reliable using regex is, but it works for now
      const match = events.match(RegExp(`(?<="component_groups":\\[.*)"${key}"(?=.*\\])`));
      if (!match) {
        changed = true;
        console.log(`Unused component_group: "${key}" in ${path}`);
        delete bp.component_groups[key];
      }
    }
    if (changed) {
      await writeJson(path, data);
    }
  }

  cleanFiles("BP", "animations", keys);
  cleanFiles("BP", "animation_controllers", keys);
}
