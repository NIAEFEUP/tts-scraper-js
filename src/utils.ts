/**
 * Deletes everything until the first occurrence of char
 * @param str
 * @param char
 */
export function deleteUntilFirstOccurence(str: string, char: string): string {
  return str.substring(str.indexOf(char) + 1);
}

/**
 * Parses "FEP,FEUP" into an array containing ["FEP", "FEUP"]
 * @param input
 */
export function parseList(input: string): string[] {
  return input.split(",");
}

/**
 * Flattens an array
 * @param array
 */
export function flatten<T>(array: T[]): T {
  return [].concat.apply([], array);
}
