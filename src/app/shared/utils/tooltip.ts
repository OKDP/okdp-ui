import { MatTooltip } from '@angular/material/tooltip';

/**
 * Temporarily replaces a MatTooltip's text, forces a refresh immediately,
 * then restores it after a delay.
 *
 * - If the tooltip is currently visible, it will be re-shown with the new text.
 * - You can keep an external binding (e.g., `[matTooltip]="copyTooltip"`) in sync
 *   by passing `updateBinding`, which will be called with both the temporary and
 *   restored text values.
 *
 * @param tip         The MatTooltip instance obtained from the template reference.
 * @param tempText    The temporary text to show (e.g., "Copied!").
 * @param resetText   The text to restore to after the delay (e.g., "Copy to clipboard").
 * @param options
 *  - duration        How long to keep `tempText` before restoring (ms). Default: 1000.
 *  - show            Whether to show the tooltip immediately after swapping text. Default: true.
 *  - updateBinding   Optional callback to update your component's tooltip binding string.
 */
export function flashTooltip(
  tip: MatTooltip,
  tempText: string,
  resetText: string,
  options?: {
    duration?: number;
    show?: boolean;
    updateBinding?: (text: string) => void;
  }
): void {
  const { duration = 1000, show = true, updateBinding } = options ?? {};

  // Set temporary text and refresh immediately
  tip.hide(0);
  tip.message = tempText;
  updateBinding?.(tempText);
  if (show) tip.show();

  // Restore after the delay
  window.setTimeout(() => {
    tip.hide(0);
    tip.message = resetText;
    updateBinding?.(resetText);
    // Optionally: tip.show(); // if you want to show again after reset
  }, duration);
}

/**
 * Convenience helper specifically for "Copied!" UX.
 *
 * @param tip            The MatTooltip instance.
 * @param options
 *  - resetText          Text to restore to. Default: "Copy to clipboard".
 *  - duration           Delay in ms before restoring. Default: 1000.
 *  - updateBinding      Callback to keep your `[matTooltip]` binding in sync.
 */
export function showCopiedTooltip(
  tip: MatTooltip,
  options?: {
    resetText?: string;
    duration?: number;
    updateBinding?: (text: string) => void;
  }
): void {
  const { resetText = 'Copy to clipboard', duration = 1000, updateBinding } = options ?? {};
  flashTooltip(tip, 'Copied!', resetText, { duration, show: true, updateBinding });
}
