// For usage information, see the README.md file.

// Database type definitions for storing data per brand and brand template
type BrandId = string;
type BrandData = {
  name: string;
  brandTemplates: Map<BrandTemplateId, BrandTemplateData>;
};

type BrandTemplateId = string;
type BrandTemplateData = {
  applyCount: number;
};

/**
 * Create a Map object that will act as an in-memory database for this example. This DB stores
 * data on a per-brand basis. Each brand contains multiple brand templates, keyed by brand
 * template ID.
 */
export const createInMemoryDatabase = () => {
  return new Map<BrandId, BrandData>();
};

let brandCounter = 1;
export const createBrand = () => ({
  name: `FooBar's Brand ${brandCounter++}`,
  brandTemplates: new Map<BrandTemplateId, BrandTemplateData>(),
});
