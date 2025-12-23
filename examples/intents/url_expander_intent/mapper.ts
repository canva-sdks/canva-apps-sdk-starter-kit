import type {
  Asset,
  AudioAsset,
  DocumentAsset,
  ImageAsset,
  SheetAsset,
  VideoAsset,
} from "@canva/intents/asset";
import type { BaseAsset } from "./asset";

export function mapBaseAssetToURLExpanderAsset(asset: BaseAsset): Asset {
  switch (asset.type) {
    case "audio":
      return {
        type: "audio",
        name: asset.name,
        url: asset.url,
        mimeType: asset.mimeType as AudioAsset["mimeType"],
      };
    case "image":
      return {
        type: "image",
        name: asset.name,
        url: asset.url,
        thumbnailUrl: asset.thumbnailUrl || "",
        mimeType: asset.mimeType as ImageAsset["mimeType"],
      };
    case "video":
      return {
        type: "video",
        name: asset.name,
        url: asset.url,
        thumbnailImageUrl: asset.thumbnailImageUrl || asset.thumbnailUrl || "",
        mimeType: asset.mimeType as VideoAsset["mimeType"],
      };
    case "document":
      return {
        type: "document",
        name: asset.name,
        url: asset.url,
        mimeType: asset.mimeType as DocumentAsset["mimeType"],
      };
    case "sheet":
      return {
        type: "sheet",
        name: asset.name,
        url: asset.url,
        mimeType: asset.mimeType as SheetAsset["mimeType"],
      };
    case "generic":
      return {
        type: "generic",
        name: asset.name,
        url: asset.url,
        mimeType: asset.mimeType,
      };
    default:
      throw new Error(`Unsupported asset type: ${asset.type}`);
  }
}
