import { build } from "esbuild";

const args = process.argv[2];
const parsedArgs = args ? JSON.parse(args) : {};

const config = {
  entryPoints: ["./data/scripts/main.ts"],
  format: "esm",
  ...parsedArgs,
};
// Only add external if bundle is true (or not explicitly set to false)
if (config.bundle !== false && config.external === undefined) {
  config.external = ["@minecraft/server", "@minecraft/server-ui"];
}
// Default bundle to true only if not specified
if (config.bundle === undefined) {
  config.bundle = true;
}
if (!config.outdir && !config.outfile) {
  config.outfile = "./BP/scripts/main.js";
}
await build(config);
