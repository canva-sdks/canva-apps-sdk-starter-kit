import type { Config } from "@canva/app-components";

type ContainerTypes = "folder";
export const config: Config<ContainerTypes> = {
  serviceName: "Example App",
  search: {
    enabled: true,
    filterFormConfig: {
      containerTypes: ["folder"],
      filters: [
        {
          filterType: "CHECKBOX",
          label: "File Type",
          key: "fileType",
          options: [
            { value: "mp4", label: "MP4" },
            { value: "png", label: "PNG" },
            { value: "jpeg", label: "JPEG" },
          ],
          allowCustomValue: true,
        },
        {
          filterType: "RADIO",
          label: "Size",
          key: "size",
          options: [
            {
              label: "Large (800+ px)",
              value: "large",
            },
            {
              label: "Medium (200-799px)",
              value: "medium",
            },
          ],
          allowCustomValue: true,
          customValueInputType: "SIZE_RANGE",
        },
        {
          filterType: "RADIO",
          label: "Update Date",
          key: "updateDate",
          options: [
            { value: ">now-30m", label: "Last 30 Minutes" },
            { value: ">now-7d", label: "Last 7 days" },
          ],
          allowCustomValue: true,
          customValueInputType: "DATE_RANGE",
        },
        {
          filterType: "RADIO",
          label: "Design Status",
          key: "designStatus",
          options: [
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "draft", label: "Draft" },
          ],
          allowCustomValue: true,
          customValueInputType: "PLAIN_TEXT",
        },
      ],
    },
  },
  containerTypes: [
    {
      value: "folder",
      label: "Folders",
      listingSurfaces: [
        { surface: "HOMEPAGE" },
        {
          surface: "CONTAINER",
          parentContainerTypes: ["folder"],
        },
        { surface: "SEARCH" },
      ],
      searchInsideContainer: {
        enabled: true,
        placeholder: "Search for resources inside this folder",
      },
    },
  ],
  sortOptions: [
    { value: "created_at DESC", label: "Creation date (newest)" },
    { value: "created_at ASC", label: "Creation date (oldest)" },
    { value: "updated_at DESC", label: "Updated (newest)" },
    { value: "updated_at ASC", label: "Updated (oldest)" },
    { value: "name ASC", label: "Name (A-Z)" },
    { value: "name DESC", label: "Name (Z-A)" },
  ],
  layouts: ["MASONRY", "LIST"],
  resourceTypes: ["IMAGE", "VIDEO", "EMBED"],
  moreInfoMessage:
    "At the moment, we only support images and videos. Corrupted and unsupported files will not appear.",
};
