import * as React from "react";
import { AppProcessInfo } from "sdk/preview/platform";
import { LaunchParams } from "./app";
import { upload } from "@canva/asset";
import { useSelection } from "utils/use_selection_hook";
import { appProcess } from "@canva/preview/platform";
import styles from "styles/components.css";

type OverlayProps = {
  context: AppProcessInfo<LaunchParams>;
};

type UIState = {
  brushSize: number;
};

export const Overlay = (props: OverlayProps) => {
  const { context: appContext } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDragginRef = React.useRef<boolean>();
  const selection = useSelection("image");
  const uiStateRef = React.useRef<UIState>({
    brushSize: 7,
  });

  React.useEffect(() => {
    if (!appContext.launchParams) {
      return;
    }

    const { selectedImageUrl, ...uiState } = appContext.launchParams;

    // set initial ui state
    uiStateRef.current = uiState;

    // set up canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("no canvas");
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("failed to create context 2d");
    }

    // download selected image url
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImageUrl;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (img.complete) {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    });

    canvas.addEventListener("pointerdown", (e) => {
      isDragginRef.current = true;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (isDragginRef.current) {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(
          e.clientX,
          e.clientY,
          uiStateRef.current.brushSize,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    });

    canvas.addEventListener("pointerup", () => {
      isDragginRef.current = false;
    });

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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selection || selection.count !== 1) {
      return;
    }

    return void appProcess.current.setOnDispose(async ({ reason }) => {
      if (reason === "aborted") {
        return;
      }
      const draft = await selection.read();
      const queueImage = await upload({
        type: "IMAGE",
        mimeType: "image/png",
        url: canvas.toDataURL(),
        thumbnailUrl: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height,
      });
      draft.contents[0].ref = queueImage.ref;
      await draft.save();
    });
  }, [selection]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
