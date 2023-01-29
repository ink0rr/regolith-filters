type DescriptionLike = {
  animations?: Record<string, string>;
  render_controllers?: (string | Record<string, string>)[];
};

export function getKeys(description: DescriptionLike, keys: Set<string>) {
  for (const key of Object.values(description.animations ?? {})) {
    keys.add(key);
  }
  for (const key of description.render_controllers ?? []) {
    if (typeof key === "string") {
      keys.add(key);
    } else {
      keys.add(Object.keys(key)[0]);
    }
  }
}
