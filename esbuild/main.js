import { build } from "esbuild";

const args = process.argv[2];

await build({
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
  ...(args && JSON.parse(args)),
});
