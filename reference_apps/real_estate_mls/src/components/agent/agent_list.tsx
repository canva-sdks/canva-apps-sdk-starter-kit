import type { Agent } from "../../real_estate.type";
import { ListAgentCard } from "./agent_card";

interface AgentListProps {
  agents: Agent[];
  onAgentClick: (item: Agent) => void;
}

export const AgentList = ({ agents, onAgentClick }: AgentListProps) => {
  return (
    <>
      {agents.map((item: Agent) => (
        <ListAgentCard key={item.id} item={item} onClick={onAgentClick} />
      ))}
    </>
  );
};
