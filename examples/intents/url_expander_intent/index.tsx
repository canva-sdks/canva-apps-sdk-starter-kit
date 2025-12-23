// For usage information, see the README.md file.
import type {
  ExpandUrlRequest,
  ExpandUrlResponse,
  GetContentRequest,
  GetContentResponse,
  UrlExpanderIntent,
} from "@canva/intents/asset";
import { prepareUrlExpander } from "@canva/intents/asset";
import { exampleAssets } from "./asset";
import { mapBaseAssetToURLExpanderAsset } from "./mapper";

/**
 * Retrieves the reference of an asset by an URL.
 *
 * @param request - The request object containing the an URL, and the requestConnection callback.
 * @returns A promise resolving to the reference content or an error status
 */
async function expandUrl(
  request: ExpandUrlRequest,
): Promise<ExpandUrlResponse> {
  /**
   * If your app requires OAuth to access user data, you can use the auth and oauth module to handle authentication.
   * Here's an example of how to request a connection and authorization:
   * ```
   * if (!await oauth.getAccessToken()) {
   *  await request.requestConnection();
   *  await oauth.requestAuthorization();
   * }
   * ```
   * Please await the completion of requests before proceeding with any further logic.
   * RequestConnection allows the user trigger the connection flow by themselves through the Canva UI.
   */
  const foundAsset = exampleAssets.find((a) => a.url === request.url);

  if (foundAsset) {
    return {
      status: "completed",
      result: {
        ref: {
          type: "asset",
          id: foundAsset.id,
          name: foundAsset.name,
          iconUrl: foundAsset.url,
          description: foundAsset.mimeType,
        },
      },
    };
  } else {
    return { status: "not_found" };
  }
}

/**
 * Retrieves the full content of an asset by its reference ID.
 *
 * @param request - The request object containing the asset reference, and the requestConnection callback.
 * @returns A promise resolving to the asset content or an error status
 */
async function getContent(
  request: GetContentRequest,
): Promise<GetContentResponse> {
  const { ref } = request;

  /**
   * Implement a similar OAuth flow as shown in the expandUrl handler,
   * to ensure you can retrieve the token when getContent is being called independently.
   * Please await the completion of requests before proceeding with any further logic.
   * RequestConnection allows the user trigger the connection flow by themselves through the Canva UI.
   */

  const foundAsset = exampleAssets.find((asset) => asset.id === ref.id);

  if (!foundAsset) {
    return {
      status: "app_error",
      message: "Asset not found",
    };
  }

  return {
    status: "completed",
    result: {
      type: "asset",
      asset: mapBaseAssetToURLExpanderAsset(foundAsset),
    },
  };
}

// Configure the URL Expander intent with required callbacks
const urlExpander: UrlExpanderIntent = {
  expandUrl,
  getContent,
};
prepareUrlExpander(urlExpander);
