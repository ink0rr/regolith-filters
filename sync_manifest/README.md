# Sync Manifest

Sync `manifest.json` files with your `config.json`

```jsonc
{
  "name": "My project",
  "version": "1.1.0", // Version of the project
  "targetVersion": "1.19.50", // min_engine_version of the project
  "packs": {
    "behaviorPack": "./packs/BP",
    "resourcePack": "./packs/RP"
  },
  "worlds": [
    "./worlds/*"
  ]
}
```
