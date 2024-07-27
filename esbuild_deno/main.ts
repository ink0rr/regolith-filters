import * as esbuild from "https://deno.land/x/esbuild@v0.23.0/mod.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.10.3";
import { resolve } from "jsr:@std/path@1.0.2";

function parseArgs(args: string[]): [Record<string, unknown>, ...string[]] {
  try {
    const settings = JSON.parse(args[0]);
    return [settings, ...args.slice(1)];
  } catch {
    return [{}, ...args];
  }
}

const [settings, path] = parseArgs(Deno.args);

const configPath = resolve(Deno.env.get("ROOT_DIR")!, path ?? "./deno.json");

try {
  await esbuild.build({
    plugins: [...denoPlugins({ configPath })],
    bundle: true,
    entryPoints: [
      "./data/scripts/main.ts",
    ],
    external: [
      "@minecraft/server",
      "@minecraft/server-ui",
    ],
    format: "esm",
    outfile: "./BP/scripts/main.js",
    ...settings,
  });
} catch (e) {
  console.log(e.message);
} finally {
  esbuild.stop();
}
