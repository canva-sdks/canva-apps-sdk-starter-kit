import type { Config } from "@canva/app-components";
import { useIntl } from "react-intl";

type ContainerTypes = "folder";
export const useConfig = (): Config<ContainerTypes> => {
  const intl = useIntl();
  return {
    serviceName: intl.formatMessage({
      defaultMessage: "Example App",
      description:
        "Name of the service where the app will pull digital assets from",
    }),
    search: {
      enabled: true,
      filterFormConfig: {
        containerTypes: ["folder"],
        filters: [
          {
            filterType: "CHECKBOX",
            label: intl.formatMessage({
              defaultMessage: "File Type",
              description: "Label of filters for file type",
            }),
            key: "fileType",
            // These options do not need to be translated as they are universal technical terms
            /* eslint-disable formatjs/no-literal-string-in-object */
            options: [
              { value: "mp4", label: "MP4" },
              { value: "png", label: "PNG" },
              { value: "jpeg", label: "JPEG" },
            ],
            /* eslint-enable formatjs/no-literal-string-in-object */
            allowCustomValue: true,
          },
          {
            filterType: "RADIO",
            label: intl.formatMessage({
              defaultMessage: "Size",
              description: "Label of filters for asset size",
            }),
            key: "size",
            options: [
              {
                label: intl.formatMessage({
                  defaultMessage: "Large (800+ px)",
                  description: "One of the filter options for asset size",
                }),
                value: "large",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Medium (200-799px)",
                  description: "One of the filter options for asset size",
                }),
                value: "medium",
              },
            ],
            allowCustomValue: true,
            customValueInputType: "SIZE_RANGE",
          },
          {
            filterType: "RADIO",
            label: intl.formatMessage({
              defaultMessage: "Update Date",
              description: "Label of the filters for asset's update date",
            }),
            key: "updateDate",
            options: [
              {
                value: ">now-30m",
                label: intl.formatMessage({
                  defaultMessage: "Last 30 Minutes",
                  description:
                    "One of the filter options for asset update date",
                }),
              },
              {
                value: ">now-7d",
                label: intl.formatMessage({
                  defaultMessage: "Last 7 days",
                  description:
                    "One of the filter options for asset update date",
                }),
              },
            ],
            allowCustomValue: true,
            customValueInputType: "DATE_RANGE",
          },
          {
            filterType: "RADIO",
            label: intl.formatMessage({
              defaultMessage: "Design Status",
              description: "Label of the filters for asset's design status",
            }),
            key: "designStatus",
            options: [
              {
                value: "approved",
                label: intl.formatMessage({
                  defaultMessage: "Approved",
                  description:
                    "One of the filter options for asset design status",
                }),
              },
              {
                value: "rejected",
                label: intl.formatMessage({
                  defaultMessage: "Rejected",
                  description:
                    "One of the filter options for asset design status",
                }),
              },
              {
                value: "draft",
                label: intl.formatMessage({
                  defaultMessage: "Draft",
                  description:
                    "One of the filter options for asset design status",
                }),
              },
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
        label: intl.formatMessage({
          defaultMessage: "Folders",
          description: "Name of the asset container type",
        }),
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
          placeholder: intl.formatMessage({
            defaultMessage: "Search for media inside this folder",
            description: "Placeholder of a search input box",
          }),
        },
      },
    ],
    sortOptions: [
      {
        value: "created_at DESC",
        label: intl.formatMessage({
          defaultMessage: "Creation date (newest)",
          description: "One of the sort options",
        }),
      },
      {
        value: "created_at ASC",
        label: intl.formatMessage({
          defaultMessage: "Creation date (oldest)",
          description: "One of the sort options",
        }),
      },
      {
        value: "updated_at DESC",
        label: intl.formatMessage({
          defaultMessage: "Updated (newest)",
          description: "One of the sort options",
        }),
      },
      {
        value: "updated_at ASC",
        label: intl.formatMessage({
          defaultMessage: "Updated (oldest)",
          description: "One of the sort options",
        }),
      },
      {
        value: "name ASC",
        label: intl.formatMessage({
          defaultMessage: "Name (A-Z)",
          description: "One of the sort options",
        }),
      },
      {
        value: "name DESC",
        label: intl.formatMessage({
          defaultMessage: "Name (Z-A)",
          description: "One of the sort options",
        }),
      },
    ],
    layouts: ["MASONRY", "LIST"],
    resourceTypes: ["IMAGE", "VIDEO", "EMBED"],
    moreInfoMessage: intl.formatMessage({
      defaultMessage:
        "At the moment, we only support images and videos. Corrupted and unsupported files will not appear.",
      description: "Helper text to explain why some assets are not visible",
    }),
    // TODO remove `export` if your app does not support exporting the Canva design into an external platform
    export: {
      enabled: true,
      // TODO provide a container type that user can choose to save into, or remove this field if user doesn't need to choose a container
      containerTypes: ["folder"],
      // TODO remove file types that are not supported by your platform
      acceptedFileTypes: [
        "png",
        "pdf_standard",
        "jpg",
        "gif",
        "svg",
        "video",
        "pptx",
      ],
    },
  };
};
