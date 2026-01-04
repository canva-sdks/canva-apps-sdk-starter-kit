import type { Asset } from "@canva/intents/asset";

export interface BaseAsset {
  id: string;
  type: Asset["type"];
  name: string;
  url: string;
  mimeType: Asset["mimeType"];
  parentRef?: string;
  // Optional fields for specific asset types
  thumbnailUrl?: string;
  thumbnailImageUrl?: string;
}

export const audioAssets: BaseAsset[] = [
  {
    id: "aud-1",
    type: "audio",
    name: `audio/wave`,
    url: `https://www.canva.dev/example-assets/audio-import/audio.wav`,
    mimeType: "audio/wave",
    parentRef: undefined,
  },
  {
    id: "aud-2",
    type: "audio",
    name: `audio/vnd.wave`,
    url: `https://www.canva.dev/example-assets/audio-import/audio.wav`,
    mimeType: "audio/vnd.wave",
    parentRef: undefined,
  },
];

export const imageAssets: BaseAsset[] = [
  {
    id: "img-1",
    type: "image",
    name: `image.heic`,
    url: `https://www.canva.dev/example-assets/image-import/sample3.heif`,
    thumbnailUrl: `https://www.canva.dev/example-assets/image-import/sample3thumbnail.heif`,
    mimeType: "image/heic",
    parentRef: undefined,
  },
  {
    id: "img-2",
    type: "image",
    name: `image.jpeg`,
    url: `https://www.canva.dev/example-assets/image-import/grass-image.jpg`,
    thumbnailUrl: `https://www.canva.dev/example-assets/image-import/grass-image-thumbnail.jpg`,
    mimeType: "image/jpeg",
    parentRef: undefined,
  },
];

export const documentAssets: BaseAsset[] = [
  {
    id: "doc-1",
    type: "document",
    name: `application/pdf`,
    url: `https://www.canva.dev/example-assets/document-import/document.pdf`,
    mimeType: "application/pdf",
    parentRef: undefined,
  },
  {
    id: "doc-2",
    type: "document",
    name: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    url: `https://www.canva.dev/example-assets/document-import/document.docx`,
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    parentRef: undefined,
  },
];

export const sheetAssets: BaseAsset[] = [
  {
    id: "sheet-1",
    type: "sheet",
    name: `text/csv`,
    url: `https://www.canva.dev/example-assets/sheet-import/sheet.csv`,
    mimeType: "text/csv",
    parentRef: undefined,
  },
  {
    id: "sheet-2",
    type: "sheet",
    name: `application/vnd.ms-excel`,
    url: `https://www.canva.dev/example-assets/sheet-import/sheet.xls`,
    mimeType: "application/vnd.ms-excel",
    parentRef: undefined,
  },
];

export const videoAssets: BaseAsset[] = [
  {
    id: "vid-1",
    type: "video",
    name: `video/avi`,
    url: `https://www.canva.dev/example-assets/video-import/video.avi`,
    thumbnailImageUrl: `https://www.canva.dev/example-assets/video-import/avi.png`,
    mimeType: "video/avi",
    parentRef: undefined,
  },
  {
    id: "vid-2",
    type: "video",
    name: `video/x-msvideo`,
    url: `https://www.canva.dev/example-assets/video-import/video.avi`,
    thumbnailImageUrl: `https://www.canva.dev/example-assets/video-import/avi.png`,
    mimeType: "video/x-msvideo",
    parentRef: undefined,
  },
];

export const genericAssets: BaseAsset[] = [
  {
    id: "gen-1",
    type: "generic",
    name: `zip`,
    url: `https://www.canva.dev/example-assets/generic-import/Archive.zip`,
    mimeType: "application/zip-compressed",
    parentRef: undefined,
  },
];

export const exampleAssets: BaseAsset[] = [
  ...audioAssets,
  ...imageAssets,
  ...documentAssets,
  ...videoAssets,
  ...genericAssets,
];
