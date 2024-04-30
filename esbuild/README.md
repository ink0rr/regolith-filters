# esbuild

Filter to run [esbuild](https://esbuild.github.io/) with Regolith.

## Settings

Refer to esbuild [documentation page](https://esbuild.github.io/api) for a
complete list of settings.

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
