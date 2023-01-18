import * as JSONC from "https://deno.land/std@0.170.0/encoding/jsonc.ts";

export async function readJson<T>(path: string) {
  return JSONC.parse(await Deno.readTextFile(path)) as T;
}

export async function writeJson(path: string, data: unknown) {
  await Deno.writeTextFile(path, JSON.stringify(data, null, 2) + "\n");
}
