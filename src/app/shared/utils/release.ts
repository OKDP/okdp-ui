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

import { stringify } from 'yaml';
import { REGISTRY_REPO_URL_PATTERN } from '../../core/constants';

export interface Parameter {
  name: string;
  value: any;
}

export function deflateParameters(params: Parameter[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const param of params) {
    if (!param.name || param.value === undefined || param.value === null) continue;

    const keys = param.name.split('.');
    let currentLevel = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        currentLevel[key] = param.value;
      } else {
        if (typeof currentLevel[key] !== 'object' || currentLevel[key] === null) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    }
  }

  return result;
}

/**
 * Extracts the package name (the last path segment) from a registry URL.
 *
 * For example:
 * - quay.io/kubocd/packages/cert-manager → "cert-manager"
 * - quay.io/kubocd/packages/cert-manager:v1234 → "cert-manager"
 * - https://quay.io/org/package:tag → "package"
 *
 * @param url - The registry URL string (with or without tag)
 * @returns The package name, or null if no match is found
 */
export function extractPackage(url: string): string {
  const match = url.match(REGISTRY_REPO_URL_PATTERN);
  return match ? match[1] : '';
}

/**
 * Picks only the specified allowed fields from an object, returning a new object.
 *
 * This is useful for stripping UI-only or extended fields from an object
 * (such as removing all non-Release fields from a ReleaseInstance).
 *
 * @param obj           The original object to pick fields from.
 * @param allowedFields An array of string keys that should be retained in the new object.
 * @returns             A shallow copy containing only the allowed fields present in the original object.
 *
 * @example
 * const releaseKeys = ['apiVersion', 'kind', 'metadata', 'spec', 'status'];
 * const clean = pickFields(instance, releaseKeys);
 */
export function pickFields<T extends object>(obj: T, allowedFields: string[]): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allowedFields) {
    if (key in obj) {
      result[key as keyof T] = obj[key as keyof T];
    }
  }
  return result;
}

/**
 * Copy any JS value to the clipboard as YAML.
 *
 * @param data - Any serializable value (object/array/primitive) to encode as YAML.
 */
export async function copyToClipboardYaml(data: any): Promise<void> {
  const yaml = stringify(data ?? {});
  const secureClipboard =
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard &&
    (window.isSecureContext ?? location.protocol === 'https:');

  if (secureClipboard) {
    try {
      await navigator.clipboard.writeText(yaml);
      return;
    } catch {
      // fallback below
    }
  }

  const ta = document.createElement('textarea');
  ta.value = yaml;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
}

/**
 * Download any JS value as a .yaml file.
 *
 * @param data - Any serializable value to encode as YAML.
 * @param options.filename - File name (default: "data.yaml").
 * @param options.mimeType - MIME type (default: "text/yaml;charset=utf-8").
 */
export function downloadYaml(data: any, options?: { filename?: string; mimeType?: string }): void {
  const { filename = 'data.yaml', mimeType = 'text/yaml;charset=utf-8' } = options ?? {};
  const yaml = stringify(data ?? {});
  const blob = new Blob([yaml], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = sanitizeFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_');
}
