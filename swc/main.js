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
    const source = file.toString();
    const { code } = await transformFile(source, {
      jsc: {
        target: "es2020",
      },
    });
    const dest = source.replace(".ts", ".js");

    await Promise.all([
      writeFile(dest, code),
      unlink(source),
    ]);
  }
}
