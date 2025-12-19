import { denoPlugin } from "jsr:@deno/esbuild-plugin";
import { resolve } from "jsr:@std/path";
import * as esbuild from "npm:esbuild";

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
  const config: esbuild.BuildOptions = {
    plugins: [denoPlugin({ configPath })],
    bundle: true,
    entryPoints: [
      "./data/scripts/main.ts",
    ],
    external: [
      "@minecraft/server",
      "@minecraft/server-ui",
    ],
    format: "esm",
    ...settings,
  };
  if (!config.outdir && !config.outfile) {
    config.outfile = "./BP/scripts/main.js";
  }
  await esbuild.build(config);
} finally {
  esbuild.stop();
}
