import * as yaml from 'yaml';
import * as semver from 'semver';
import { FormArray, FormBuilder } from '@angular/forms';

export function toUri(path: string) {
  return '/' + path;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Converts a JSON object into an equivalent YAML string.
 *
 * @param jsonInput - The JSON object to be converted to YAML.
 * @returns The YAML string representation of the JSON input.
 *
 * @example
 * const jsonInput = {
 *   comment: "my comment",
 *   gitRepoFolder: "/path/to/git/folder",
 *   componentReleases: [
 *     {
 *       name: "TheName",
 *       namespace: "TheNamespace",
 *       dependsOn: ["dep01", "dep02"],
 *       roles: ["role01", "role02"],
 *       component: {
 *         name: "jupyter",
 *         version: "v1.2.0",
 *         parameters: {
 *           "": ""
 *         }
 *       }
 *     }
 *   ]
 * };
 * const yamlOutput = convertJsonToYaml(jsonInput);
 * console.log(yamlOutput);
 *
 * // Output:
 * // comment: my comment
 * // gitRepoFolder: /path/to/git/folder
 * // componentReleases:
 * //   - name: TheName
 * //     namespace: TheNamespace
 * //     dependsOn:
 * //       - dep01
 * //       - dep02
 * //     roles:
 * //       - role01
 * //       - role02
 * //     component:
 * //       name: jupyter
 * //       version: v1.2.0
 * //       parameters:
 * //         "": ""
 */
export function convertJsonToYaml(jsonInput: object): string {
  try {
    // Convert the JSON object to a YAML string using the yaml library
    const yamlOutput = yaml.stringify(jsonInput);
    return yamlOutput;
  } catch (error) {
    console.error('Error converting JSON to YAML:', error);
    throw new Error('Failed to convert JSON to YAML');
  }
}

/**
 * Converts any input field to an empty array if the input is:
 * - empty (i.e., `""`)
 * - undefined
 * - "null" (string)
 * - null
 * Otherwise, returns the input as it is.
 *
 * @param {any} input - The input field to be checked.
 * @returns {any} - The input field converted to an empty array if it meets the conditions; otherwise, returns the original input.
 */
export function sanitizeArray(input: any): any {
  if (input === null || input === undefined || input === 'null' || (Array.isArray(input) && input.length === 0)) {
    return [];
  }

  return input;
}

/**
 * Sanitizes an input object by checking if it is null, undefined, empty, or the string "null".
 * If any of these conditions are met, it returns an empty object `{}`. Otherwise, it returns the original object.
 *
 * @param input - The object to sanitize.
 * @returns The original object if it is valid; otherwise, an empty object.
 */
export function sanitizeObject(input: any): Record<string, any> {
  if (
    input === null ||
    input === undefined ||
    input === 'null' ||
    (typeof input === 'object' && Object.keys(input).length === 0)
  ) {
    return {};
  }

  return input;
}

/**
 * Sorts an array of version strings in descending order using the semver library.
 *
 * @param {string[]} versions - An array of version strings (e.g., "1.2.0", "1.3.0", etc.).
 * @returns {string[]} - The array sorted in descending order.
 */
export function sortVersionsDesc(versions: string[]): string[] {
  return versions.sort((a, b) => {
    if (semver.gt(b, a)) return 1;
    if (semver.lt(b, a)) return -1;
    return 0;
  });
}

/**
 * Function to extract the latest version from an array of semver versions.
 * It uses the semver library to correctly compare the versions and find the latest one.
 *
 * @param versions - An array of semver version strings.
 * @returns {string | null} The latest semver version from the array, or null if the array is empty.
 */
export function getLatestVersion(versions: string[]): string | null {
  if (versions.length === 0) {
    return '';
  }

  const sortedVersions = versions.sort((a, b) => semver.compare(b, a));

  return sortedVersions[0];
}

/**
 * Utility function to update a `FormArray` with new values.
 * This function clears all existing controls in the form array
 * and replaces them with new controls containing the provided values.
 *
 * @param formArray - The `FormArray` instance to be updated.
 * @param values - An array of strings to populate the `FormArray`.
 * @param fb - An instance of `FormBuilder` to create form controls.
 *
 * @example
 * const formArray = new FormArray([]);
 * updateFormArray(formArray, ['value1', 'value2'], fb);
 * console.log(formArray.value); // Output: ['value1', 'value2']
 */
export function updateFormArray(formArray: FormArray, values: string[], fb: FormBuilder): void {
  // Clear the form array
  formArray.clear();

  // Add new values to the form array
  values.forEach(value => {
    formArray.push(fb.control(value), { emitEvent: false });
  });
}

/**
 * Flattens a deeply nested object into a single-level object with dot notation keys.
 *
 * This function recursively traverses the object, converting nested objects into
 * a flat structure where each key represents the full path in dot notation.
 * It also replaces any `null` values with an empty string (`""`).
 *
 * @param {any} obj - The object to be flattened. Can be any structure including objects, arrays, and primitives.
 * @param {string} [parentKey=''] - The prefix for the current key, used in recursive calls to build the full key path.
 *
 * @returns {Object} - A flattened object where keys are in dot notation, and values are the corresponding values from the original object.
 *                     Any `null` values will be replaced with an empty string (`""`).
 *
 * @example
 * const exampleObject = {
 *   ingress: {
 *     certificateIssuer: "myCERT",
 *     url: "https://myCERT.example",
 *     level2: {
 *       certificateIssuerLevel2: "example1",
 *       url: "example2",
 *       something: null,
 *       anotherLevel: {
 *         and: "sone",
 *       },
 *     },
 *     other: null,
 *   },
 * };
 *
 * const dotNotationObject = convertToJsonDotNotation(exampleObject);
 * console.log(dotNotationObject);
 * // Output:
 * // {
 * //   "ingress.certificateIssuer": "myCERT",
 * //   "ingress.url": "https://myCERT.example",
 * //   "ingress.level2.certificateIssuerLevel2": "example1",
 * //   "ingress.level2.url": "example2",
 * //   "ingress.level2.something": "",
 * //   "ingress.level2.anotherLevel.and": "sone",
 * //   "ingress.other": ""
 * // }
 */
export function convertToJsonDotNotation(obj: any, parentKey: string = ''): { [key: string]: any } {
  const result: { [key: string]: any } = {};
  const sanitizedObj = sanitizeObject(obj);
  // Iterate through each key-value pair in the object
  for (const [key, value] of Object.entries(sanitizedObj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // If the value is an object, recursively process it
      Object.assign(result, convertToJsonDotNotation(value, newKey));
    } else {
      // If the value is null, replace with an empty string
      result[newKey] = value === null ? '' : value;
    }
  }

  return result;
}

/**
 * Converts an object with dot notation keys back into a nested object.
 *
 * This function takes an object where the keys are in dot notation (representing nested objects)
 * and reconstructs the original nested structure. It also replaces empty strings with `null` values.
 *
 * @param {Object} obj - The object with dot notation keys to be converted.
 *
 * @returns {Object} - A nested object where keys are converted back from dot notation to nested structure.
 *
 * @example
 * const dotNotationObject = {
 *   "ingress.certificateIssuer": "myCERT",
 *   "ingress.url": "https://google.com",
 *   "ingress.level2.certificateIssuerLevel2": "example1",
 *   "ingress.level2.url": "example2",
 *   "ingress.level2.something": "",
 *   "ingress.level2.anotherLevel.and": "sone",
 *   "ingress.other": ""
 * };
 *
 * const nestedObject = convertFromJsonDotNotation(dotNotationObject);
 * console.log(nestedObject);
 * // Output:
 * // {
 * //   ingress: {
 * //     certificateIssuer: "myCERT",
 * //     url: "https://google.com",
 * //     level2: {
 * //       certificateIssuerLevel2: "example1",
 * //       url: "example2",
 * //       something: null,
 * //       anotherLevel: {
 * //         and: "sone"
 * //       }
 * //     },
 * //     other: null
 * //   }
 * // }
 */
export function fromJsonDotNotationToNested(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  const result: { [key: string]: any } = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Check if the key contains single quotes and remove them if so
      const cleanedKey =
        key.startsWith("'") && key.endsWith("'")
          ? key.slice(1, -1) // Remove the surrounding single quotes
          : key;

      // If the key has dots, split it into parts for nested objects
      const keys = cleanedKey.includes('.') ? cleanedKey.split('.') : [cleanedKey];

      // Reduce the keys to form the nested object structure
      keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) {
          acc[part] = value === '' ? null : value; // Replace empty strings with null
        } else {
          acc[part] = acc[part] || {};
        }
        return acc[part];
      }, result);

      // If the key originally had single quotes, we set the key as it was (with quotes).
      if (key.startsWith("'") && key.endsWith("'")) {
        result[`"${cleanedKey}"`] = value;
      }
    }
  }

  return result;
}

/**
 * Recursively removes all keys with empty string values ("") from an object.
 *
 * @param obj - The input object to clean.
 * @returns A new object with empty string values removed.
 */
export function sanitizeEmptyValues<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const isArray = Array.isArray(obj);
  const cleaned: any = isArray
    ? (obj as any[]).map(sanitizeEmptyValues) // Recursively clean each element in the array.
    : Object.keys(obj).reduce(
        (acc, key) => {
          const value = (obj as Record<string, any>)[key];

          if (value !== '') {
            acc[key] = sanitizeEmptyValues(value);
          }
          return acc;
        },
        isArray ? [] : ({} as Record<string, any>)
      );

  return cleaned as T;
}
