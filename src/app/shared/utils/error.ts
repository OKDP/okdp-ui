/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
