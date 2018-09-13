/**
 * Deletes everything until the first occurrence of char
 * @param str
 * @param char
 */
export function deleteUntilFirstOccurence(str: string, char: string): string {
  return str.substring(str.indexOf(char) + 1);
}
