import type {
  FindResourcesRequest,
  FindResourcesResponse,
} from "@canva/app-components";
import { auth } from "@canva/user";

export async function findResources(
  request: FindResourcesRequest<"folder">
): Promise<FindResourcesResponse> {
  const userToken = await auth.getCanvaUserToken();

  // TODO: Update the API path to match your backend
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
  } catch (e) {
    return {
      type: "ERROR",
      errorCode: "INTERNAL_ERROR",
    };
  }
}
