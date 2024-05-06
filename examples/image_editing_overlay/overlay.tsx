import * as React from "react";
import { LaunchParams } from "./app";
import { getTemporaryUrl, upload } from "@canva/asset";
import { useSelection } from "utils/use_selection_hook";
import { appProcess, AppProcessInfo, CloseParams } from "@canva/platform";
import { SelectionEvent } from "@canva/design";

// App can extend CloseParams type to send extra data when closing the overlay
// For example:
// type CloseOpts = CloseParams & { message: string }
export type CloseOpts = CloseParams;

type OverlayProps = {
  context: AppProcessInfo<LaunchParams>;
};

type UIState = {
  brushSize: number;
};

export const Overlay = (props: OverlayProps) => {
  const { context: appContext } = props;
  const selection = useSelection("image");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDragginRef = React.useRef<boolean>();
  const uiStateRef = React.useRef<UIState>({
    brushSize: 7,
  });

  React.useEffect(() => {
    if (!selection || selection.count !== 1) {
      return;
    }

    if (
      !appContext.launchParams ||
      appContext.surface !== "selected_image_overlay"
    ) {
      return void abort();
    }

    // set initial ui state
    const uiState = appContext.launchParams;
    uiStateRef.current = uiState;

    // set up canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      return void abort();
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return void abort();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // load and draw image to canvas
    let img = new Image();
    let cssScale = 1;
    const drawImage = () => {
      // Set the canvas dimensions to match the original image dimensions to maintain image quality,
      // when saving the output image back to the design using canvas.toDataUrl()
      cssScale = window.innerWidth / img.width;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.transform = `scale(${cssScale})`;
      canvas.style.transformOrigin = "0 0";
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onload = drawImage;
    img.crossOrigin = "anonymous";
    (async () => {
      const selectedImageUrl = await loadOriginalImage(selection);
      if (!selectedImageUrl) {
        return void abort();
      }
      img.src = selectedImageUrl;
    })();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (img.complete) {
        drawImage();
      }
    });

    canvas.addEventListener("pointerdown", (e) => {
      isDragginRef.current = true;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (isDragginRef.current) {
        const mousePos = getCanvasMousePosition(canvas, e);
        context.fillStyle = "white";
        context.beginPath();
        context.arc(
          mousePos.x,
          mousePos.y,
          uiStateRef.current.brushSize * (1 / cssScale),
          0,
          Math.PI * 2
        );
        context.fill();
      }
    });

    canvas.addEventListener("pointerup", () => {
      isDragginRef.current = false;
    });

    return void appProcess.current.setOnDispose<CloseOpts>(
      async ({ reason }) => {
        // abort if image has not loaded or receive `aborted` signal
        if (reason === "aborted" || !img.src || !img.complete) {
          return;
        }
        const dataUrl = canvas.toDataURL();
        const draft = await selection.read();
        const queueImage = await upload({
          type: "IMAGE",
          mimeType: "image/png",
          url: dataUrl,
          thumbnailUrl: dataUrl,
          width: canvas.width,
          height: canvas.height,
        });
        draft.contents[0].ref = queueImage.ref;
        await draft.save();
      }
    );
  }, [selection]);

  React.useEffect(() => {
    // set up message handler
    return void appProcess.registerOnMessage((_, message) => {
      if (!message) {
        return;
      }
      const { brushSize } = message as UIState;
      uiStateRef.current = {
        ...uiStateRef.current,
        brushSize: brushSize,
      };
    });
  }, []);

  return <canvas ref={canvasRef} />;
};

const abort = () => appProcess.current.requestClose({ reason: "aborted" });

const loadOriginalImage = async (selection: SelectionEvent<"image">) => {
  if (selection.count !== 1) {
    return;
  }
  const draft = await selection.read();
  const { url } = await getTemporaryUrl({
    type: "IMAGE",
    ref: draft.contents[0].ref,
  });
  return url;
};

// get the mouse position relative to the canvas
const getCanvasMousePosition = (
  canvas: HTMLCanvasElement,
  event: PointerEvent
) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};
