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

export const getPlayerIntegerAttributeValue = (
  tags: string[],
  tagName: string,
  defaultValue: number = 0
): number => {
  const tag = tags.find((t) => t.startsWith(`${tagName}:`));

  if (!tag) {
    return defaultValue;
  }

  const parsedValue = parseInt(tag.split(":")[1] || "", 10);
  return parsedValue === undefined ? defaultValue : parsedValue;
};

export const getPlayerBooleanAttributeValue = (
  tags: string[],
  tagName: string,
  defaultValue: boolean = false
): boolean => {
  return tags.includes(tagName) ? true : defaultValue;
};

export const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10]! || s[v]! || s[0]!);
};

export function replaceFirstLetterWithZ(inputString: string): string {
  if (inputString.length === 0) {
    // Handle empty string case
    return inputString;
  }

  const firstLetter = inputString[0];
  const restOfString = inputString.slice(1);

  // Replace the first letter with 'Z' and concatenate the rest of the string
  const modifiedString = "Z" + restOfString;

  return modifiedString;
}
