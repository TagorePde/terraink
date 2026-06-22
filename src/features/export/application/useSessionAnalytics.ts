import { useEffect } from "react";
import { detectAdBlocker } from "@/features/export/application/adBlockDetection";
import { trackEvent } from "@/core/services";

// Sample once per page load, not per component remount.
let reported = false;

/**
 * Fires once-per-session analytics on app load for every visitor:
 *  - `app_open` with the display mode (standalone PWA vs browser tab)
 *  - `ad_blocker_detected` / `ad_blocker_not_detected`
 *
 * All aggregate and non-personal. Caveat: network/DNS blockers also block GA,
 * so the ad-block count is a lower bound (cosmetic blockers like uBlock are
 * captured).
 */
export function useSessionAnalytics(): void {
  useEffect(() => {
    if (reported) return;
    reported = true;

    const displayMode =
      document.documentElement.dataset.displayMode === "standalone"
        ? "standalone"
        : "browser";
    trackEvent("app_open", { display_mode: displayMode });

    void detectAdBlocker().then((blocked) => {
      trackEvent(blocked ? "ad_blocker_detected" : "ad_blocker_not_detected");
    });
  }, []);
}
