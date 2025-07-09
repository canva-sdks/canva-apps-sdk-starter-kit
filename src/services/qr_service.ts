import QRCode from "qrcode";
import Papa from "papaparse";
import { upload } from "@canva/asset";
import type { QrSpec, DetectedPosition } from "../types/qr";

/**
 * Genera un data URL per un QR code dal testo fornito
 */
export async function generateDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 0,
    errorCorrectionLevel: "H",
  });
}

/**
 * Carica un QR code su Canva e restituisce il riferimento
 */
export async function uploadQr(
  dataUrl: string,
  size: { width: number; height: number }
): Promise<string> {
  const uploadResult = await upload({
    type: "image",
    mimeType: "image/png",
    url: dataUrl,
    thumbnailUrl: dataUrl,
    width: size.width,
    height: size.height,
    aiDisclosure: "none",
  });

  return uploadResult.ref;
}

/**
 * Crea l'elemento per aggiungere un QR code a una pagina
 */
export function createPageWithQr(
  qrSpec: QrSpec,
  position: DetectedPosition
) {
  return {
    type: "image" as const,
    dataUrl: qrSpec.dataUrl,
    top: position.top,
    left: position.left,
    width: position.width,
    height: position.height,
    altText: {
      text: `QR Code: ${qrSpec.text}`,
      decorative: false,
    },
  };
}

/**
 * Parsa un file CSV e restituisce una Promise con le righe come array di stringhe
 */
export function parseCsv(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string>(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const items = result.data.map((row) => row[0]);
        resolve(items);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Genera QR specs per un array di testi
 */
export async function generateQrCodes(texts: string[]): Promise<QrSpec[]> {
  const qrCodes: QrSpec[] = [];
  
  for (const text of texts) {
    const dataUrl = await generateDataUrl(text);
    qrCodes.push({ text, dataUrl });
  }
  
  return qrCodes;
} 