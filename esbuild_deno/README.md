# Esbuild Deno

Filter to run [esbuild](https://esbuild.github.io/) with Regolith and Deno.

## Settings

Refer to esbuild [documentation page](https://esbuild.github.io/api) for a complete list of settings.

### Default Settings

```json
{
  "bundle": true,
  "entryPoints": [
    "./data/scripts/main.ts"
  ],
  "external": [
    "@minecraft/server",
    "@minecraft/server-ui"
  ],
  "format": "esm",
  "outfile": "./BP/scripts/main.js"
}
```

### Change `deno.json` Path

You can pass in an argument to change the `deno.json` path.

```json
{
  "filter": "esbuild_deno",
  "arguments": [
    "./data/deno.json"
  ],
  "settings": {
    "minify": true
  }
}
```
