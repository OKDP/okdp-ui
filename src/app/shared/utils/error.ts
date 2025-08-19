/**
 * Extracts a human-readable error message from various error object shapes.
 *
 * This function is designed for Angular's HttpErrorResponse and similar error payloads.
 * It gracefully handles:
 *   - `HttpErrorResponse` objects where `error` is a JSON string
 *   - Direct error objects with a `message` property
 *   - Plain string errors
 *   - Fallback to statusText or a generic "Unknown error"
 *
 * Example input shapes:
 *
 * 1. Angular HttpErrorResponse with stringified JSON:
 * {
 *   status: 422,
 *   message: "Http failure response for ...: 422 Unprocessable Entity",
 *   error: "{\"message\":\"Failed to fetch logs...\",\"status\":422,\"type\":\"k8s_cluster\"}"
 * }
 *
 * 2. Angular HttpErrorResponse with object in `error`:
 * {
 *   status: 404,
 *   error: { message: "Not found", status: 404 }
 * }
 *
 * 3. Plain Error object:
 * { message: "Something went wrong" }
 *
 * 4. Plain string:
 * "Network unreachable"
 *
 * @param err - The error object (can be any shape from HttpErrorResponse to plain string)
 * @returns A string containing the extracted error message
 */
export function errorMessage(err: any): string {
  if (!err) return 'Unknown error';

  let payload: any = err.error ?? err;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return payload;
    }
  }

  if (payload && typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof err.message === 'string') {
    return err.message;
  }

  if (typeof err.statusText === 'string') {
    return err.statusText;
  }

  return 'Unknown error';
}
