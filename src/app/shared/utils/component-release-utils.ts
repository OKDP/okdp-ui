import { fromJsonDotNotationToNested, sanitizeEmptyValues } from './utils';

/**
 * Converts the "parameters" array of key-value pairs in the component release into a "parameters" object.
 *
 * @param input - The input object containing a "parameters" array under `componentRelease.component`.
 * @returns A new object with the "parameters" array replaced by an object.
 *
 * @example
 * const input = {
 *   componentRelease: {
 *     component: {
 *       parameters: [
 *         { name: "key1", value: "value1" },
 *         { name: "key2", value: "value2" }
 *       ]
 *     }
 *   }
 * };
 * const output = transformParameters(input);
 * // output.componentRelease.component.parameters:
 * // {
 * //   key1: "value1",
 * //   key2: "value2"
 * // }
 */
export function parametersArrayToObject(input: any): any {
  const output = { ...input };

  const parametersArray = output.componentRelease.component.parameters;
  const parametersObject = parametersArray.reduce(
    (acc: Record<string, string>, param: { name: string; value: string }) => {
      if (param.name && param.value) {
        acc[param.name] = param.value;
      }
      return acc;
    },
    {}
  );

  output.componentRelease.component.parameters = fromJsonDotNotationToNested(parametersObject);

  if (Object.keys(parametersObject).length === 0) {
    delete output.componentRelease.component.parameters;
  } else {
    output.componentRelease.component.parameters = parametersObject;
  }

  return output;
}

/**
 * Converts the "componentRelease" object in the input JSON into an array "componentReleases".
 *
 * @param input - The input object containing a single "componentRelease" key.
 * @returns A new object with "componentRelease" replaced by "componentReleases" as an array.
 *
 * @example
 * const input = {
 *   comment: "my comment",
 *   gitRepoFolder: "/path/to/git/folder",
 *   componentRelease: {
 *     name: "TheName",
 *     namespace: "TheNamespace",
 *     dependsOn: ["dep01", "dep02"],
 *     roles: ["role01", "role02"],
 *     component: {
 *       name: "jupyter",
 *       version: "v1.2.0",
 *       parameters: {
 *         "name": "isName.no",
 *         "dot.yes": "no.dot"
 *       }
 *     }
 *   }
 * };
 * const output = convertComponentReleaseToReleases(input);
 * // Output:
 * // {
 * //   comment: "my comment",
 * //   gitRepoFolder: "/path/to/git/folder",
 * //   componentReleases: [{
 * //     name: "TheName",
 * //     namespace: "TheNamespace",
 * //     dependsOn: ["dep01", "dep02"],
 * //     roles: ["role01", "role02"],
 * //     component: {
 * //       name: "jupyter",
 * //       version: "v1.2.0",
 * //       parameters: {
 * //         "name": "isName.no",
 * //         "dot.yes": "no.dot"
 * //       }
 * //     }
 * //   }]
 * // }
 */
export function convertComponentReleaseToReleases(input: any): any {
  // Clone the input to avoid mutating the original object
  const output = { ...input };

  // Extract the componentRelease object and convert it to an array
  const componentRelease = sanitizeEmptyValues(output.componentRelease);
  output.componentReleases = [componentRelease];

  // Remove the original componentRelease key
  delete output.componentRelease;

  return output;
}
