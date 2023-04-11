export function getPlayerAttributeValueFromTags(
  tags: string[],
  attributeName: string,
  defaultValue: string
): string {
  const tag = tags.find((t) => t.startsWith(`${attributeName}:`));
  if (!tag) {
    return defaultValue;
  }
  const value = tag.split(":")[1];
  return value || defaultValue;
}