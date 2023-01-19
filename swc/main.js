import { transformFile } from "@swc/core";
import { fdir } from "fdir";
import { unlink, writeFile } from "fs/promises";

const files = await new fdir()
  .withFullPaths()
  .exclude((dir) => dir === "node_modules")
  .filter((path) => path.endsWith(".ts"))
  .crawl("BP/scripts")
  .withPromise();

if (Array.isArray(files)) {
  for (const file of files) {
    const path = file.toString();
    const transformed = await transformFile(path, {
      jsc: {
        target: "es2020",
      },
    });
    const dest = path.replace(".ts", ".js");

    await Promise.all([
      writeFile(dest, transformed.code),
      unlink(file.toString()),
    ]);
  }
}
