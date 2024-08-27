import type {
  AppProcessId,
  OverlayOpenableEvent,
  OverlayTarget,
} from "@canva/design";
import { overlay as designOverlay } from "@canva/design";
import type { CloseParams } from "@canva/platform";
import { appProcess } from "@canva/platform";
import { useEffect, useState } from "react";

const initialOverlayEvent: OverlayOpenableEvent<OverlayTarget> = {
  canOpen: false,
  reason: "",
};

/**
 * Returns an object which contains the following field:
 *  1. canOpen - a boolean indicate whether the overlay can be opened on the specified target.
 *  2. isOpen - a boolean indicate whether the overlay is currently open.
 *  3. open - a function to open an overlay on the specified target.
 *  4. close - a function close the currently opened overlay.
 * @param target The overlay target to register for whether we can open an overlay.
 */
export function useOverlay<
  T extends OverlayTarget,
  C extends CloseParams = CloseParams,
>(
  target: T,
): {
  canOpen: boolean;
  isOpen: boolean;
  open: (opts?: {
    launchParameters?: unknown;
  }) => Promise<AppProcessId | undefined>;
  close: (opts: C) => Promise<void>;
} {
  const [overlay, setOverlay] =
    useState<OverlayOpenableEvent<T>>(initialOverlayEvent);
  const [overlayId, setOverlayId] = useState<AppProcessId>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    return designOverlay.registerOnCanOpen({
      target,
      onCanOpen: setOverlay,
    });
  }, []);

  useEffect(() => {
    if (overlayId) {
      appProcess.registerOnStateChange(overlayId, ({ state }) =>
        setIsOpen(state === "open"),
      );
    }
  }, [overlayId]);

  const open = async (
    opts: { launchParameters?: unknown } = {},
  ): Promise<AppProcessId | undefined> => {
    if (overlay && overlay.canOpen) {
      const overlayId = await overlay.open(opts);
      setOverlayId(overlayId);
      return overlayId;
    }
  };

  const close = async (opts: C) => {
    if (overlayId) {
      appProcess.requestClose<C>(overlayId, opts);
    }
  };

  return { canOpen: overlay.canOpen, isOpen, open, close };
}
