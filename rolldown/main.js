import { build } from "rolldown";

const args = process.argv[2];
const parsedArgs = args ? JSON.parse(args) : {};

/** @type {import("rolldown").OutputOptions} */
const output = { ...parsedArgs.output };
if (!output.dir && !output.file) {
  output.file = "./BP/scripts/main.js";
}

await build({
  input: "./data/scripts/main.ts",
  external: ["@minecraft/server", "@minecraft/server-ui"],
  ...parsedArgs,
  output,
});
