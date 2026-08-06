import { requestOpenExternalUrl } from "@canva/platform";

export const openExternalUrl = async (url: string) => {
  await requestOpenExternalUrl({ url });
};
