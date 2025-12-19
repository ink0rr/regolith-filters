import { build } from "esbuild";

const args = process.argv[2];
const parsedArgs = args ? JSON.parse(args) : {};

const config = {
  bundle: true,
  entryPoints: ["./data/scripts/main.ts"],
  external: ["@minecraft/server", "@minecraft/server-ui"],
  format: "esm",
  ...parsedArgs,
};
if (!config.outdir && !config.outfile) {
  config.outfile = "./BP/scripts/main.js";
}
await build(config);
