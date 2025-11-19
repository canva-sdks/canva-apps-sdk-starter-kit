import { getTemporaryUrl, upload } from "@canva/asset";
import { appProcess } from "@canva/platform";
import * as React from "react";
import { useSelection } from "utils/use_selection_hook";

export const SelectedImageOverlay = () => {
  const selection = useSelection("image");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const originalImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const initializeCanvas = async () => {
      try {
        // Get the selected image
        const draft = await selection.read();
        const [image] = draft.contents;

        if (!image) {
          return;
        }

        // Download the selected image
        const { url } = await getTemporaryUrl({
          type: "image",
          ref: image.ref,
        });
        const img = await downloadImage(url);

        // Store reference to original image for reset functionality
        originalImageRef.current = img;

        // Render the selected image
        const { canvas, context } = getCanvas(canvasRef.current);
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        // Notify that image is ready
        appProcess.broadcastMessage({ isImageReady: true });
      } catch {
        appProcess.broadcastMessage({ isImageReady: false });
      }
    };

    initializeCanvas();
  }, [selection]);

  React.useEffect(() => {
    // Listen for editing commands from the object panel
    appProcess.registerOnMessage(async (sender, message) => {
      if (
        typeof message !== "object" ||
        message == null ||
        !("action" in message)
      ) {
        return;
      }

      try {
        const { canvas, context } = getCanvas(canvasRef.current);

        switch (message.action) {
          case "invert":
            context.filter = "invert(100%)";
            context.drawImage(canvas, 0, 0);
            break;

          case "blur":
            context.filter = "blur(3px)";
            context.drawImage(canvas, 0, 0);
            break;

          case "reset":
            if (originalImageRef.current) {
              context.filter = "none";
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(originalImageRef.current, 0, 0);
            }
            break;

          default:
            // Unknown action, do nothing
            break;
        }
      } catch {
        // Silently handle effect application errors
      }
    });
  }, []);

  React.useEffect(() => {
    // Handle overlay disposal (save or close)
    return void appProcess.current.setOnDispose(async (context) => {
      try {
        // Save changes if user completed the editing
        if (context.reason === "completed") {
          // Get the modified image data
          const { canvas } = getCanvas(canvasRef.current);
          const dataUrl = canvas.toDataURL("image/png", 1.0);

          // Upload the modified image
          const asset = await upload({
            type: "image",
            mimeType: "image/png",
            url: dataUrl,
            thumbnailUrl: dataUrl,
            aiDisclosure: "none",
          });

          // Replace the original image with the modified version
          const draft = await selection.read();
          const [image] = draft.contents;

          if (!image) {
            return;
          }

          image.ref = asset.ref;
          await draft.save();
        }

        // Reset image readiness state
        appProcess.broadcastMessage({ isImageReady: false });
      } catch {
        // Handle save errors silently
      }
    });
  }, [selection]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};

// Utility function to download image from URL
const downloadImage = async (url: string): Promise<HTMLImageElement> => {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image could not be loaded"));
    img.src = objectUrl;
  });

  URL.revokeObjectURL(objectUrl);
  return img;
};

// Utility function to get canvas and context in a type-safe way
const getCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) {
    throw new Error("HTMLCanvasElement does not exist");
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("CanvasRenderingContext2D does not exist");
  }

  return { canvas, context };
};
