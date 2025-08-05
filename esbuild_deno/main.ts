import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
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
  console.error(e);
} finally {
  esbuild.stop();
}
