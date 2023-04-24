import { EntityBehavior, Event, EventAction, readJson, writeJson } from "https://deno.land/x/lazuli@0.0.4/mod.ts";
import glob from "npm:tiny-glob";
import { cleanFiles } from "./cleanFiles.ts";
import { getKeys } from "./getKeys.ts";

export async function checkBP() {
  const keys = new Set<string>();

  for (const path of await glob("BP/entities/**/*.json").catch(() => [])) {
    const data = await readJson<EntityBehavior>(path);
    const bp = data["minecraft:entity"];
    getKeys(bp.description, keys);

    if (!bp.component_groups) continue;

    const groupKeys = new Set(Object.keys(bp.component_groups));
    const checkEventAction = (eventAction?: EventAction) => {
      if (!eventAction) return;
      for (const group of eventAction.component_groups ?? []) {
        if (groupKeys.has(group)) {
          groupKeys.delete(group);
        }
      }
    };
    const checkEvent = (event: Event) => {
      checkEventAction(event.add);
      checkEventAction(event.remove);
      event.sequence?.forEach(checkEvent);
      event.randomize?.forEach(checkEvent);
    };
    for (const key in bp.events) {
      checkEvent(bp.events[key]);
    }

    groupKeys.forEach((key) => {
      console.warn(`Unused component group: "${key}" in ${path}`);
      delete bp.component_groups![key];
    });
    if (groupKeys.size) {
      await writeJson(path, data);
    }
  }

  cleanFiles("BP", "animations", keys);
  cleanFiles("BP", "animation_controllers", keys);
}
