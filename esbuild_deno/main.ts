import { resolve } from "https://deno.land/std@0.213.0/path/resolve.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.20.0/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.5/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ROOT_DIR = Deno.env.get("ROOT_DIR")!;

const {
  configPath,
  entryPoint,
  outfile,
  minify,
} = z.object({
  configPath: z.string().default("./deno.json").transform((path) => resolve(ROOT_DIR, path)),
  entryPoint: z.string().default("./data/scripts/main.ts"),
  outfile: z.string().default("./BP/scripts/main.js"),
  minify: z.boolean().default(true),
}).parse(JSON.parse(Deno.args[0] ?? "{}"));

try {
  await esbuild.build({
    plugins: [...denoPlugins({ configPath })],
    bundle: true,
    entryPoints: [
      entryPoint,
    ],
    external: [
      "@minecraft/server",
      "@minecraft/server-ui",
    ],
    format: "esm",
    outfile,
    minify,
  });
} catch (e) {
  console.log(e.message);
} finally {
  esbuild.stop();
}
