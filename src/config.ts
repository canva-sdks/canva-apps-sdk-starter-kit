import { Config } from "@canva/app-components";

type ContainerTypes = "folder";

export const DASH_CONFIG: Config<ContainerTypes> = {
  serviceName: "Dash App",
  search: {
    enabled: true,
    placeholder: "Search for images in your Dash",
  },
  layouts: ["MASONRY"],
  resourceTypes: ["IMAGE"],
  moreInfoMessage: "At the moment, we only support images. Corrupted and unsupported files will not appear."
};
