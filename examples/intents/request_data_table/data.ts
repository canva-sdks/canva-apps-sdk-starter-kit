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

// A small hardcoded dataset. A real Data Connector would fetch data like this
// from an external API, using the request's `dataSourceRef` to identify what
// to fetch.
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
