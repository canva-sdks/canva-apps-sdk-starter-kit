import React, { useState } from "react";
import {
  Rows,
  Text,
  Title,
  Box,
  Columns,
  Column,
  Pill,
  Alert,
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@canva/app-ui-kit";
import { useAddElement } from "utils/use_add_element";
import { useSelection } from "utils/use_selection_hook";

/**
 * Field definition interface
 */
interface DataField {
  name: string;
  key: string;
  description: string;
  fieldType?: "text" | "number" | "currency" | "percentage" | "media";
}

/**
 * Category definition interface
 */
interface DataCategory {
  title: string;
  description: string;
  fields: DataField[];
}

/**
 * Data field definitions for each object type
 */
export const DATA_FIELDS: Record<string, DataCategory> = {
  agent: {
    title: "Agent Profile Fields",
    description: "Fields available for agent/team member profiles",
    fields: [
      { name: "Name", key: "name", description: "Agent's display name", fieldType: "text" },
      { name: "First Name", key: "firstName", description: "Agent's first name", fieldType: "text" },
      { name: "Last Name", key: "lastName", description: "Agent's last name", fieldType: "text" },
      { name: "Full Name", key: "fullName", description: "Agent's complete name", fieldType: "text" },
      { name: "Email", key: "email", description: "Agent's email address", fieldType: "text" },
      { name: "Phone", key: "phone", description: "Agent's phone number", fieldType: "text" },
      { name: "Mobile", key: "mobile", description: "Agent's mobile number", fieldType: "text" },
      { name: "Office", key: "office", description: "Office location/name", fieldType: "text" },
      { name: "Position", key: "position", description: "Job position/role", fieldType: "text" },
      { name: "Title", key: "title", description: "Professional title", fieldType: "text" },
      { name: "Bio", key: "bio", description: "Agent biography", fieldType: "text" },
      { name: "Photo", key: "photo", description: "Agent headshot/profile photo", fieldType: "media" },
    ],
  },
  listing: {
    title: "Property Listing Fields",
    description: "Fields available for property listings",
    fields: [
      { name: "Address", key: "address", description: "Full street address", fieldType: "text" },
      { name: "Suburb", key: "suburb", description: "Suburb name", fieldType: "text" },
      { name: "State", key: "state", description: "State/territory", fieldType: "text" },
      { name: "Postcode", key: "postcode", description: "Postal code", fieldType: "text" },
      { name: "Price", key: "price_advertise_as", description: "Advertised price", fieldType: "currency" },
      { name: "Status", key: "status", description: "Listing status (current, sold, etc.)", fieldType: "text" },
      { name: "Property Type", key: "property_type", description: "Type of property", fieldType: "text" },
      { name: "Bedrooms", key: "bedrooms", description: "Number of bedrooms", fieldType: "number" },
      { name: "Bathrooms", key: "bathrooms", description: "Number of bathrooms", fieldType: "number" },
      { name: "Car Spaces", key: "garages", description: "Number of car spaces/garages", fieldType: "number" },
      { name: "Land Area", key: "landarea", description: "Land size", fieldType: "text" },
      { name: "Year Built", key: "year_built", description: "Year property was built", fieldType: "text" },
      { name: "Listed Date", key: "listed_at", description: "Date property was listed", fieldType: "text" },
      { name: "Listing ID", key: "external_id", description: "External listing reference", fieldType: "text" },
      { name: "Category", key: "property_category", description: "Property category", fieldType: "text" },
      { name: "Photos", key: "photos", description: "Property images", fieldType: "media" },
    ],
  },
  marketData: {
    title: "Market Data Fields",
    description: "Fields available for suburb market statistics",
    fields: [
      { name: "Suburb/Postcode", key: "suburbpostcode", description: "Suburb and postcode identifier", fieldType: "text" },
      { name: "Sales (12 months)", key: "sales_12m", description: "Number of sales in last 12 months", fieldType: "number" },
      { name: "Median Price (12 months)", key: "median_price_12m", description: "Median sale price over 12 months", fieldType: "currency" },
      { name: "Price Change (12 months)", key: "change_12m_median_price_12m", description: "Percentage change in median price", fieldType: "percentage" },
      { name: "Total Sales Value (12 months)", key: "total_sales_value_12m", description: "Total value of all sales", fieldType: "currency" },
      { name: "Month End", key: "month_end", description: "Data reporting period end date", fieldType: "text" },
      { name: "Average Days on Market", key: "avg_days_on_market_12m", description: "Average time to sell", fieldType: "number" },
      { name: "Vendor Discount", key: "vendor_discount_12m", description: "Average discount from asking price", fieldType: "percentage" },
      { name: "Clearance Rate", key: "clearance_rate_12m", description: "Auction clearance rate", fieldType: "percentage" },
    ],
  },
};

interface DataFieldsTabProps {
  onFieldClick?: (fieldKey: string) => void;
}

const getFieldTypeLabel = (fieldType?: string): string | null => {
  switch (fieldType) {
    case "number":
      return "Number";
    case "currency":
      return "Currency";
    case "percentage":
      return "Percentage";
    case "media":
      return "Image";
    default:
      return null;
  }
};

export const DataFieldsTab: React.FC<DataFieldsTabProps> = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["agent", "listing", "marketData"]);
  const addElement = useAddElement();
  const textSelection = useSelection("plaintext");

  const handleFieldClick = async (fieldKey: string) => {
    const placeholder = `{{${fieldKey}}}`;

    try {
      const selection = await textSelection.read();

      if (selection.contents.length > 0) {
        // Replace selected text with placeholder
        const content = selection.contents[0];
        content.text = placeholder;
        await selection.save();
      } else {
        // Add new text element with placeholder
        addElement({
          type: "text",
          children: [placeholder],
        });
      }
    } catch {
      // Fallback: add new text element
      addElement({
        type: "text",
        children: [placeholder],
      });
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const renderFieldList = (fields: DataField[]) => {
    return (
      <Rows spacing="1u">
        {fields.map((field) => {
          const typeLabel = getFieldTypeLabel(field.fieldType);
          return (
            <Box
              key={field.key}
              background="neutralLow"
              padding="1u"
              borderRadius="standard"
            >
              <Columns spacing="1u" alignY="center">
                <Column width="1/3">
                  <Rows spacing="0.5u">
                    <Text size="small" variant="bold">
                      {field.name}
                    </Text>
                    {typeLabel && (
                      <Text size="xsmall" tone="tertiary">{typeLabel}</Text>
                    )}
                  </Rows>
                </Column>
                <Column width="2/3">
                  <Rows spacing="0.5u">
                    <Pill
                      text={`{{${field.key}}}`}
                      onClick={() => handleFieldClick(field.key)}
                      ariaLabel={`Add ${field.name} placeholder`}
                    />
                    <Text size="xsmall" tone="tertiary">
                      {field.description}
                    </Text>
                  </Rows>
                </Column>
              </Columns>
            </Box>
          );
        })}
      </Rows>
    );
  };

  const renderSection = (sectionKey: string, category: DataCategory) => {
    const isExpanded = expandedSections.includes(sectionKey);

    return (
      <Box key={sectionKey}>
        <Button
          variant="tertiary"
          onClick={() => toggleSection(sectionKey)}
          icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="end"
          stretch
          alignment="start"
        >
          {category.title}
        </Button>
        {isExpanded && (
          <Box paddingTop="1u" paddingStart="1u">
            <Rows spacing="1u">
              <Text size="small" tone="tertiary">
                {category.description}
              </Text>
              {renderFieldList(category.fields)}
            </Rows>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Rows spacing="2u">
      <Title size="small">Template Data Fields</Title>

      <Alert tone="info">
        <Text size="small">
          Click on a field placeholder to add it to your design. Use these placeholders in your templates for data autofill.
        </Text>
      </Alert>

      {/* Agent Fields */}
      {renderSection("agent", DATA_FIELDS.agent)}

      {/* Listing Fields */}
      {renderSection("listing", DATA_FIELDS.listing)}

      {/* Market Data Fields */}
      {renderSection("marketData", DATA_FIELDS.marketData)}

      {/* Usage Instructions */}
      <Box background="neutralLow" padding="2u" borderRadius="standard">
        <Rows spacing="1u">
          <Text variant="bold" size="small">How to use:</Text>
          <Text size="small">
            1. Create a template design in Canva
          </Text>
          <Text size="small">
            2. Add placeholder text elements using the field keys above (e.g., {"{{address}}"})
          </Text>
          <Text size="small">
            3. Use Bulk Create or Data Autofill to populate your templates with real data
          </Text>
        </Rows>
      </Box>
    </Rows>
  );
};

export default DataFieldsTab;
