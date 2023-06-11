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

export const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10]! || s[v]! || s[0]!);
};
