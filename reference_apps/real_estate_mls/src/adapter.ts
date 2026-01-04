import { agents, listings } from "./data";
import type { Agent, Office, Property } from "./real_estate.type";

// TODO (App Developer): replace with the real API call
export const fetchAgents = async (
  office?: Office | null,
  query?: string,
  continuation?: string,
  sortBy?: string,
): Promise<{ agents: Agent[]; continuation?: string }> => {
  // eslint-disable-next-line no-console
  console.log("fetchingAgents", { query, continuation, office });

  if (office?.id === "listings-only-office" || office?.id === "empty-office") {
    return { agents: [], continuation: undefined };
  }

  if (office?.id === "error-office" || query === "error") {
    throw new Error("Error fetching agents");
  }
  // Apply sorting
  if (sortBy) {
    const [field, direction] = sortBy.split("-");

    if (field === "name") {
      agents.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return direction === "asc" ? comparison : -comparison;
      });
    }
  }

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 10));

  let filteredAgents = agents;

  // Apply search query
  if (query) {
    filteredAgents = filteredAgents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        (agent.officeId &&
          agent.officeId.toLowerCase().includes(query.toLowerCase())),
    );
  }

  if (filteredAgents.length === 0) {
    return { agents: [], continuation: undefined };
  }

  return {
    agents: filteredAgents,
    continuation:
      continuation && !query ? `${Number(continuation) + 1}` : undefined,
  };
};

// TODO (App Developer): replace with real API calls
export const fetchListings = async (
  office?: Office | null,
  query?: string,
  propertyType?: string | null,
  sortBy?: string | null,
  continuation?: string,
): Promise<{ listings: Property[]; continuation?: string }> => {
  // eslint-disable-next-line no-console
  console.log("fetchingListings", {
    query,
    continuation,
    propertyType,
    sortBy,
  });
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (office?.id === "empty-office" || office?.id === "agents-only-office") {
    return { listings: [], continuation: undefined };
  }

  if (office?.id === "error-office" || query === "error") {
    throw new Error("Error fetching listings");
  }

  let filteredListings = listings;

  // Example filters
  // Apply property type filter
  if (propertyType) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.listingType.toLowerCase() === propertyType.toLowerCase(),
    );
  }

  // Apply sorting filter
  if (sortBy) {
    filteredListings = [...filteredListings].sort((a, b) => {
      const aPrice = parseFloat(a.price.replace(/[$,]/g, ""));
      const bPrice = parseFloat(b.price.replace(/[$,]/g, ""));
      return sortBy === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
    });
  }

  // Apply search query
  if (query) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.address.toLowerCase().includes(query.toLowerCase()) ||
        listing.suburb.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  if (filteredListings.length === 0) {
    return { listings: [], continuation: undefined };
  }

  return {
    listings: filteredListings,
    continuation:
      continuation && !query ? `${Number(continuation) + 1}` : undefined,
  };
};
