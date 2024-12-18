import * as express from "express";
import * as crypto from "crypto";
import type { Container, Resource } from "@canva/app-components";

/**
 * Generates a unique hash for a url.
 * Handy for uniquely identifying an image and creating an image id
 */
export async function generateHash(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const imageUrls = [
  "https://cdn.pixabay.com/photo/2023/09/16/18/26/hummingbird-8257355_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/10/03/00/peacock-8440548_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/20/07/04/mountains-8459056_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/11/26/07/29/sparrow-8413000_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/12/16/11/mountain-8445543_1280.jpg",
];

export const createDamRouter = () => {
  const router = express.Router();

  /**
   * This endpoint returns the data for your app.
   */
  router.post("/resources/find", async (req, res) => {
    // You should modify these lines to return data from your
    // digital asset manager (DAM) based on the findResourcesRequest
    const {
      types,
      continuation,
      locale,
      // other available fields from the `FindResourcesRequest`
      // containerTypes,
      // limit,
      // filters,
      // query,
      // sort,
      // tab,
      // containerId,
      // parentContainerType,
    } = req.body;

    let resources: Resource[] = [];
    if (types.includes("IMAGE")) {
      resources = await Promise.all(
        Array.from({ length: 40 }, async (_, i) => ({
          id: await generateHash(imageUrls[i % imageUrls.length]),
          mimeType: "image/jpeg",
          name: `My new thing in ${locale}`, // Use the `locale` value from the request if your backend supports i18n
          type: "IMAGE",
          thumbnail: {
            url: imageUrls[i % imageUrls.length],
          },
          url: imageUrls[i % imageUrls.length],
        })),
      );
    }

    if (types.includes("CONTAINER")) {
      const containers = await Promise.all(
        Array.from(
          { length: 10 },
          async (_, i) =>
            ({
              id: await generateHash(i + ""),
              containerType: "folder",
              name: `My folder ${i}`,
              type: "CONTAINER",
            }) satisfies Container,
        ),
      );

      resources = resources.concat(containers);
    }

    res.send({
      resources,
      continuation: +(continuation || 0) + 1,
    });
  });

  return router;
};
