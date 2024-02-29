import type {
  FindResourcesRequest,
  FindResourcesResponse,
} from "@canva/app-components";
import { auth } from "@canva/user";

export async function findResources(
  request: FindResourcesRequest<"folder">
): Promise<FindResourcesResponse> {
  const userToken = await auth.getCanvaUserToken();

  // TODO: This url must be changed to `${BACKEND_HOST}/api/resources/find` to
  // ensure requests are authenticated in production
  const url = new URL(`${BACKEND_HOST}/resources/find`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const body = await response.json();

  return {
    resources: body.resources,
    type: "SUCCESS",
  };
}
