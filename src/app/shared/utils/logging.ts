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

// ===== ANSI helpers =====
export const ESC = '\x1b[';
export const RESET = `${ESC}0m`;
export const COLORS: Record<string, string> = {
  ERROR: `${ESC}31m`, // dark red
  WARN: `${ESC}33m`, // dark yellow (amber)
  INFO: '', // plain, uses theme.foreground
  DEBUG: `${ESC}35m`, // dark magenta/purple
  TRACE: `${ESC}90m`, // gray
  DEFAULT: '', // plain, uses theme.foreground
};

export function toLevel(raw?: string): 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'DEFAULT' {
  const s = (raw || '').toUpperCase();
  if (s.includes('ERROR')) return 'ERROR';
  if (s.includes('WARN')) return 'WARN';
  if (s.includes('INFO')) return 'INFO';
  if (s.includes('DEBUG')) return 'DEBUG';
  if (s.includes('TRACE')) return 'TRACE';
  return 'DEFAULT';
}

/**
 * Strip ANSI escape codes. Useful when exporting logs to a .txt file.
 */
export function stripAnsi(input: string): string {
  return input.replace(/\u001B\[[0-9;]*m/g, '');
}

/**
 * Try to parse a log line as JSON and format it.
 * If not JSON, returns the original text with inferred level.
 */
export function formatAndColorize(line: string): string {
  if (/\u001B\[[0-9;]*m/.test(line)) return line;

  try {
    const log = JSON.parse(line);
    const timestamp = log.ts ?? log.time ?? '';
    const level = toLevel(log.level);
    const logger = log.logger ? `[${log.logger}]` : '';
    const msg = log.msg ?? log.message ?? line;

    const { ts, time, level: _l, logger: _g, msg: _m, message: _mm, ...extras } = log;
    const extraFields = Object.entries(extras)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(' ');

    const prefix = timestamp ? `[${timestamp}]` : '';
    const text = `${prefix} ${level} ${logger} ${msg}${extraFields ? ' ' + extraFields : ''}`;

    const color = COLORS[level] ?? COLORS['DEFAULT'];
    return `${color}${text}${RESET}`;
  } catch {
    const guessedLevel = toLevel(line);
    const color = COLORS[guessedLevel] ?? COLORS['DEFAULT'];
    return `${color}${line}${RESET}`;
  }
}
