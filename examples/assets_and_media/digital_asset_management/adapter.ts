// For usage information, see the README.md file.
import type {
  FindResourcesRequest,
  FindResourcesResponse,
} from "@canva/app-components";
import { auth } from "@canva/user";

/**
 * Adapter function that handles communication with your digital asset management backend.
 * This function is called by SearchableListView to fetch resources based on user requests.
 */
export async function findResources(
  request: FindResourcesRequest<"folder">,
): Promise<FindResourcesResponse> {
  // Get the Canva user token for authentication with your backend
  const userToken = await auth.getCanvaUserToken();

  // Replace this URL with your actual backend endpoint.
  // For production apps, ensure your backend validates the Canva user token and implements proper security measures.
  // If using the backend example, the URL should be updated to `${BACKEND_HOST}/api/resources/find` to ensure requests are authenticated in production
  const url = new URL(`${BACKEND_HOST}/resources/find`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const body = await response.json();

    // Return successful response with resources and continuation token for pagination
    if (body.resources) {
      return {
        type: "SUCCESS",
        resources: body.resources,
        continuation: body.continuation,
      };
    }
    return {
      type: "ERROR",
      errorCode: body.errorCode || "INTERNAL_ERROR",
    };
  } catch {
    // Handle network errors or other exceptions
    return {
      type: "ERROR",
      errorCode: "INTERNAL_ERROR",
    };
  }
}
