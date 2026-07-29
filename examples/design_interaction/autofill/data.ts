// For usage information, see the README.md file.
import type {
  ColumnConfig,
  DataTable,
  DataTableRow,
} from "@canva/intents/data";

export type TeamMember = {
  name: string;
  role: string;
  location: string;
};

// A small hardcoded dataset standing in for data you'd otherwise fetch from a
// Data Connector (see the intents/request_data_table example) or an external API.
export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Ana Silva", role: "Product Designer", location: "Sydney" },
  { name: "Wei Chen", role: "Engineer", location: "Singapore" },
  { name: "Priya Nair", role: "Engineer", location: "Bengaluru" },
  { name: "Tom Baker", role: "Marketing Lead", location: "London" },
  { name: "Sofia Reyes", role: "Customer Success", location: "Austin" },
];

const COLUMN_CONFIGS: ColumnConfig[] = [
  { name: "Name", type: "string" },
  { name: "Role", type: "string" },
  { name: "Location", type: "string" },
];

// `autofillDesign` and `requestDataFieldMatching` accept the same `DataTable`
// shape as the Data Connector intent, so it's imported from `@canva/intents/data`
// rather than redeclared here.
export function buildDataTable(members: TeamMember[]): DataTable {
  const rows: DataTableRow[] = members.map((member) => ({
    cells: [
      { type: "string", value: member.name },
      { type: "string", value: member.role },
      { type: "string", value: member.location },
    ],
  }));
  return { columnConfigs: COLUMN_CONFIGS, rows };
}
