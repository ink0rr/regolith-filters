# Sync Manifest

Sync `manifest.json` files with your `config.json`

```jsonc
{
  "name": "My project",
  "version": "1.1.0", // Required, version of the project
  "targetVersion": "1.26.0", // Optional, min_engine_version of the project
  "packs": {
    "behaviorPack": "./packs/BP",
    "resourcePack": "./packs/RP"
  },
  "worlds": [
    "./worlds/*"
  ]
}
```

## Settings

| Property     | Type     | Default     | Description                                                          |
| ------------ | -------- | ----------- | -------------------------------------------------------------------- |
| `outputFile` | `string` | `undefined` | Output path for the version constants, relative to the `data` folder |
