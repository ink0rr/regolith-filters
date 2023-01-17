import { walk } from "https://deno.land/std@0.170.0/fs/mod.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { EntityResource, readJson, writeJson } from "https://deno.land/x/lazuli@0.0.4/mod.ts";

interface Settings {
  overwrite?: boolean;
}

const settings: Settings = JSON.parse(Deno.args[0] ?? "{}");

for await (const file of walk("RP/entity", { exts: ["json"] })) {
  const entity = await readJson<EntityResource>(file.path);
  const rp = entity["minecraft:client_entity"].description;

  if ((rp.spawn_egg && !settings.overwrite) || rp.identifier.startsWith("minecraft:")) {
    continue;
  }

  try {
    const texture = await Image.decode(await Deno.readFile(`RP/${rp.textures!.default}.png`));

    rp.spawn_egg = {
      base_color: rgbToHex(Image.colorToRGB(texture.dominantColor())),
      overlay_color: rgbToHex(Image.colorToRGB(texture.averageColor())),
    };

    await writeJson(file.path, entity);
  } catch {
    console.log(`Failed to generate spawn egg for ${rp.identifier}`);
    continue;
  }
}

function rgbToHex(rgb: number[]) {
  return "#" + rgb.map((n) => n.toString(16).padStart(2, "0")).join("");
}
