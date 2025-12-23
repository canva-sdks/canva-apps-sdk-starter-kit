import type { Agent, Office, Property } from "./real_estate.type";
// Example Real Estate data

// TODO: replace these with assets from your CDN
const RealEstateAgentThumbnail1 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444454/real-estate-agent-1_zhrimx.png";
const RealEstateAgentThumbnail2 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444454/real-estate-agent-2_fcculq.png";

const RealEstateListing1 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444456/real-estate-listing-1_inyeny.png";
const RealEstateListing2 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444455/real-estate-listing-2_zqaa97.png";
const RealEstateListing3 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444456/real-estate-listing-3_arbr7e.png";
const RealEstateListing4 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444456/real-estate-listing-4_b9upex.png";
const RealEstateListing5 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444463/real-estate-listing-5_isg9x1.png";
const RealEstateListing6 =
  "https://res.cloudinary.com/dxwoiemnu/image/upload/v1742444457/real-estate-listing-6_k7divw.png";

const RealEstateAvatar = "https://i.pravatar.cc/300?img=33";

export const offices: Office[] = [
  { id: "office1", name: "Murray Street" },
  { id: "office2", name: "Jermaine Street" },
  { id: "office3", name: "Brett Street" },
  { id: "empty-office", name: "Empty Office" },
  { id: "error-office", name: "Error Office" },
  { id: "agents-only-office", name: "Agents Only Office" },
  { id: "listings-only-office", name: "Listings Only Office" },
];

const getRandomAgent = () => {
  const randomIndex = Math.floor(Math.random() * agents.length);
  return agents[randomIndex];
};

export const agents: Agent[] = [
  {
    id: "agent1",
    name: "Alice",
    officeId: "office1",
    phoneNumber: "+61 2 1234 5678",
    roleTitle: "Senior Property Consultant",
    headshots: [
      {
        url: RealEstateAgentThumbnail1,
        width: 400,
        height: 400,
      },
    ],
  },
  {
    id: "agent2",
    name: "Bob",
    officeId: "office2",
    phoneNumber: "+61 2 8765 4321",
    roleTitle: "Property Manager",
    headshots: [
      {
        url: RealEstateAgentThumbnail2,
        width: 400,
        height: 400,
      },
    ],
  },
  {
    id: "agent3",
    name: "Carol",
    officeId: "office3",
    phoneNumber: "+61 2 2468 1357",
    roleTitle: "Real Estate Agent",
    headshots: [
      {
        url: RealEstateAgentThumbnail1,
        width: 400,
        height: 400,
      },
    ],
  },
];

export const listings: Property[] = [
  {
    id: "listing1",
    agent: getRandomAgent(),
    url: "/listings/123-ocean-view-drive",
    title: "Stunning Beachfront Property with Panoramic Views",
    name: "Luxury Ocean View House",
    description: "Beautiful house with stunning ocean views in Beachside",
    address: "123 Ocean View Drive",
    suburb: "Beachside",
    price: "$2,450,000",
    listingType: "House",
    thumbnail: {
      url: RealEstateListing1,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing1,
        alt: "Front view of the house",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing2,
        alt: "Backyard view",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing3,
        alt: "Kitchen interior",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing4,
        alt: "Living room",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    id: "listing2",
    agent: getRandomAgent(),
    url: "/listings/45-mountain-road",
    title: "Spacious Family Home with Mountain Vistas",
    name: "Mountain View Family Home",
    description: "Spacious family home with mountain views in Highland Park",
    address: "45 Mountain Road",
    suburb: "Highland Park",
    price: "$1,850,000",
    listingType: "House",
    thumbnail: {
      url: RealEstateListing2,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing2,
        alt: "Front view of the house",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing3,
        alt: "Mountain view from balcony",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing4,
        alt: "Family room",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing5,
        alt: "Master bedroom",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    id: "listing3",
    agent: getRandomAgent(),
    url: "/listings/789-city-center-ave",
    title: "Modern Apartment in Prime Downtown Location",
    name: "Modern Downtown Apartment",
    description: "Contemporary apartment in the heart of downtown",
    address: "789 City Center Ave",
    suburb: "Downtown",
    price: "$950,000",
    listingType: "Apartment",
    thumbnail: {
      url: RealEstateListing3,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing3,
        alt: "Front view of the apartment",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing4,
        alt: "City view from balcony",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing5,
        alt: "Modern kitchen",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing6,
        alt: "Open plan living area",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    id: "listing4",
    agent: getRandomAgent(),
    url: "/listings/321-riverside-lane",
    title: "Elegant Townhouse with River Views",
    name: "Riverside Townhouse",
    description: "Elegant townhouse with river views in Waterfront",
    address: "321 Riverside Lane",
    suburb: "Waterfront",
    price: "$1,650,000",
    listingType: "Townhouse",
    thumbnail: {
      url: RealEstateListing4,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing4,
        alt: "Front view of the townhouse",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing5,
        alt: "River view from deck",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing6,
        alt: "Gourmet kitchen",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing1,
        alt: "Master suite",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    id: "listing5",
    agent: getRandomAgent(),
    url: "/listings/567-park-view-court",
    title: "Luxury Villa Overlooking City Park",
    name: "Park View Villa",
    description:
      "Luxurious villa overlooking the city park with modern amenities",
    address: "567 Park View Court",
    suburb: "Parkview",
    price: "$2,750,000",
    listingType: "House",
    thumbnail: {
      url: RealEstateListing5,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing5,
        alt: "Front view of the villa",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing6,
        alt: "Park view from terrace",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing1,
        alt: "Infinity pool",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing2,
        alt: "Entertainment area",
        width: 1920,
        height: 1080,
      },
    ],
  },
  {
    id: "listing6",
    agent: getRandomAgent(),
    url: "/listings/890-garden-heights",
    title: "Grand Estate with Manicured Gardens",
    name: "Garden Heights Estate",
    description: "Sprawling estate with manicured gardens and pool",
    address: "890 Garden Heights Road",
    suburb: "Garden Heights",
    price: "$3,250,000",
    listingType: "House",
    thumbnail: {
      url: RealEstateListing6,
      width: 800,
      height: 600,
    },
    listing_images: [
      {
        url: RealEstateListing6,
        alt: "Front view of the estate",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing1,
        alt: "Manicured gardens",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing2,
        alt: "Swimming pool",
        width: 1920,
        height: 1080,
      },
      {
        url: RealEstateListing3,
        alt: "Grand entrance",
        width: 1920,
        height: 1080,
      },
    ],
  },
];

export const mockUserData = {
  userName: "Alex Chen",
  userEmail: "alex.chen@example.com",
  userAvatarUrl: RealEstateAvatar,
};

export const mockAgentData = {
  agentName: "${agentName}",
  roleTitle: "${agentRoleTitle}",
  phoneNumber: "${agentPhoneNumber}",
  emailAddress: "${agentEmailAddress}",
  branch: "${agentBranch}",
};
