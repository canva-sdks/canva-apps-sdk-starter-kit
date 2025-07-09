export interface QrSpec {
  text: string;
  dataUrl: string;
  uploadedRef?: string;
}

export interface DetectedPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface FailedPage {
  index: number;
  qrSpec: QrSpec;
  error: string;
}

export const DEFAULT_SIZE = { width: 300, height: 300 }; 