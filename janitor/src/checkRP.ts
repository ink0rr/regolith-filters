import { Attachable, EntityResource, readJson } from "https://deno.land/x/lazuli@0.0.4/mod.ts";
import glob from "npm:tiny-glob";
import { cleanFiles } from "./cleanFiles.ts";
import { getKeys } from "./getKeys.ts";

export async function checkRP() {
  const keys = new Set<string>();

  for (const path of await glob("RP/entity/**/*.json").catch(() => [])) {
    const data = await readJson<EntityResource>(path);
    const rp = data["minecraft:client_entity"].description;
    getKeys(rp, keys);
  }

  for (const path of await glob("RP/attachables/**/*.json").catch(() => [])) {
    const data = await readJson<Attachable>(path);
    const rp = data["minecraft:attachable"].description;
    getKeys(rp, keys);
  }

  await Promise.all([
    cleanFiles("RP", "animations", keys),
    cleanFiles("RP", "animation_controllers", keys),
    cleanFiles("RP", "render_controllers", keys),
  ]);
}
