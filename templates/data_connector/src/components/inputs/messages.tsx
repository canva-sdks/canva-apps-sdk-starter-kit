import { defineMessages } from "react-intl";

export const ownershipFilter = defineMessages({
  label: {
    defaultMessage: "Filter by Ownership",
    description: "Label for a select control to filter designs by ownership",
  },
  description: {
    defaultMessage:
      "Filter the list of designs based on the user's ownership of the designs",
    description: "Subtitle for a select control to filter designs by ownership",
  },
  any: {
    defaultMessage: "Any (default)",
    description: "Default option for ownership filter",
  },
  owned: {
    defaultMessage: "Owned by me",
    description: "Option for ownership filter",
  },
  shared: {
    defaultMessage: "Shared with me",
    description: "Option for ownership filter",
  },
});

export const datasetFilter = defineMessages({
  label: {
    defaultMessage: "Filter by Dataset",
    description: "Label for a select control to filter designs by dataset",
  },
  description: {
    defaultMessage:
      "Filter the list of brand templates based on the dataset definitions",
    description: "Subtitle for a select control to filter designs by dataset",
  },
  any: {
    defaultMessage: "Any (default)",
    description: "Default option for dataset filter",
  },
  nonEmpty: {
    defaultMessage: "Templates with one or more data fields defined",
    description: "Option for dataset filter",
  },
});

export const sortOrderField = defineMessages({
  label: {
    defaultMessage: "Sort by",
    description: "Label for a select control to sort designs",
  },
  description: {
    defaultMessage: "Sort the list of designs",
    description: "Subtitle for a select control to sort designs",
  },
  relevance: {
    defaultMessage: "Relevance (default)",
    description: "Default option for sort order",
  },
  modifiedDesc: {
    defaultMessage: "Last modified - descending",
    description: "Option for sort order",
  },
  modifiedAsc: {
    defaultMessage: "Last modified - ascending",
    description: "Option for sort order",
  },
  titleDesc: {
    defaultMessage: "Title - descending",
    description: "Option for sort order",
  },
  titleAsc: {
    defaultMessage: "Title - ascending",
    description: "Option for sort order",
  },
});

export const filterMenu = defineMessages({
  search: {
    defaultMessage: "Search",
    description: "Label for a search input field",
  },
  clear: {
    defaultMessage: "Clear all",
    description: "Label for a button to clear all filters",
  },
  apply: {
    defaultMessage: "Apply",
    description: "Label for a button to apply filters",
  },
  count: {
    defaultMessage: "Filter count",
    description: "Label for the number of active filters",
  },
});
