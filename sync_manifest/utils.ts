import * as JSONC from "jsr:@std/jsonc@0.224.0";

export async function readJson<T>(path: string) {
  return JSONC.parse(await Deno.readTextFile(path)) as T;
}

export async function writeJson(path: string, data: unknown) {
  await Deno.writeTextFile(path, JSON.stringify(data, null, 2) + "\n");
}
