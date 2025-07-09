import {
  addPage,
  addElementAtPoint,
  openDesign,
} from "@canva/design";
import type { DetectedPosition } from "../types/qr";

export interface PageElement {
  type: "image";
  dataUrl: string;
  top: number;
  left: number;
  width: number;
  height: number;
  altText: {
    text: string;
    decorative: boolean;
  };
}

/**
 * Aggiunge una nuova pagina con gli elementi specificati
 */
export async function createPage(elements: PageElement[]): Promise<void> {
  await addPage({ elements });
}

/**
 * Aggiunge un elemento immagine a un punto specifico della pagina corrente
 */
export async function addImageElement(params: {
  ref: string;
  top: number;
  left: number;
  width: number;
  height: number;
  altText: {
    text: string;
    decorative: boolean;
  };
}): Promise<void> {
  await addElementAtPoint({
    type: "image",
    ref: params.ref as any, // Cast necessario per il tipo ImageRef di Canva
    top: params.top,
    left: params.left,
    width: params.width,
    height: params.height,
    altText: params.altText,
  });
}

/**
 * Apre la sessione di design per la pagina corrente ed esegue la callback
 */
export async function openCurrentPageDesign(
  callback: (session: any) => Promise<void>
): Promise<void> {
  return openDesign({ type: "current_page" }, callback);
}

/**
 * Rileva la posizione di un elemento rettangolare nella pagina
 * Utilizzato per trovare la posizione del QR code piazzato manualmente
 */
export async function detectElementPosition(): Promise<DetectedPosition | null> {
  let foundPosition: DetectedPosition | null = null;

  await openCurrentPageDesign(async (session) => {
    if (session.page.type !== "absolute") {
      throw new Error("Page type not supported for positioning");
    }

    // Cerca elementi rettangolari (il QR code potrebbe essere aggiunto come rect)
    const rectElements = session.page.elements.filter(
      (el: any) => el.type === "rect"
    );

    if (rectElements.length > 0) {
      // Prende l'ultimo elemento rettangolare (più recente - probabilmente il nostro QR)
      const lastRect = rectElements[rectElements.length - 1];
      if (lastRect.type === "rect") {
        foundPosition = {
          top: lastRect.top,
          left: lastRect.left,
          width: lastRect.width,
          height: lastRect.height,
        };
      }
    }
  });

  return foundPosition;
} 