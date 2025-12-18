import { build } from "esbuild";

const args = process.argv[2];
const parsedArgs = args ? JSON.parse(args) : {};

// Remove conflicting default if outdir is provided
const defaultConfig = {
  bundle: true,
  entryPoints: ["./data/scripts/main.ts"],
  external: ["@minecraft/server", "@minecraft/server-ui"],
  format: "esm",
  ...(!parsedArgs.outdir && { outfile: "./BP/scripts/main.js" }),
};

await build({
  ...defaultConfig,
  ...parsedArgs,
});
