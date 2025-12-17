import { Column, Columns, Rows } from "@canva/app-ui-kit";
import type { Agent } from "../../real_estate.type";
import { GridAgentCard } from "./agent_card";

interface AgentGridProps {
  agents: Agent[];
  onAgentClick: (item: Agent) => void;
}

export const AgentGrid = ({ agents, onAgentClick }: AgentGridProps) => {
  return (
    <Rows spacing="2u">
      {agents.map((item, index) => {
        if (index % 2 === 0) {
          const nextItem = agents[index + 1];
          return (
            <Columns
              key={`row-${Math.floor(index / 2)}`}
              spacing="2u"
              alignY="stretch"
            >
              <Column key={item.id} width="1/2">
                <GridAgentCard item={item} onClick={onAgentClick} />
              </Column>
              {nextItem && (
                <Column key={nextItem.id} width="1/2">
                  <GridAgentCard item={nextItem} onClick={onAgentClick} />
                </Column>
              )}
            </Columns>
          );
        }
        return null;
      })}
    </Rows>
  );
};
