/* tslint:disable-next-line no-var-requires*/
const read = require("read");
// tslint:disable-next-line no-var-requires
const fs = require("fs");

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
export function parseIntegerList(input: string): number[] {
  return input.split(",").map((s: string) => Number.parseInt(s, 10));
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

/**
 * Read password from stdin, masking the input
 */
export function readPassword(prompt: string = "Password:"): Promise<string> {
  return new Promise((resolve, reject) => {
    read({ prompt, silent: true }, (error: any, result: string) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

/**
 * Promise version of `fs.writeFile`
 * @param file
 * @param data
 * @param options
 */
export function writeFile(
  file: string,
  data: string,
  options?: object
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, options, (err: Error) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}
