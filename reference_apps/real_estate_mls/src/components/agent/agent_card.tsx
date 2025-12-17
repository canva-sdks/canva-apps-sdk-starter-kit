import { HorizontalCard, ImageCard } from "@canva/app-ui-kit";
import React from "react";
import { useIntl } from "react-intl";
import type { Agent } from "../../real_estate.type";

interface AgentCardProps {
  item: Agent;
  onClick: (item: Agent) => void;
}

export const ListAgentCard: React.FC<AgentCardProps> = ({ item, onClick }) => {
  const intl = useIntl();
  const headshot = item.headshots?.[0];

  return (
    <HorizontalCard
      ariaLabel={item.name}
      title={item.name}
      description={item.officeId}
      onClick={() => onClick(item)}
      thumbnail={
        headshot
          ? {
              url: headshot.url,
              alt: intl.formatMessage(
                {
                  defaultMessage: "Profile photo of {name}",
                  description: "Alt text for agent profile photo",
                },
                { name: item.name },
              ),
            }
          : undefined
      }
    />
  );
};

export const GridAgentCard: React.FC<AgentCardProps> = ({ item, onClick }) => {
  const intl = useIntl();

  return (
    <ImageCard
      selectable
      thumbnailUrl={item.headshots?.[0]?.url || ""}
      alt={intl.formatMessage(
        {
          defaultMessage: "Profile photo of {name}",
          description: "Alt text for agent profile photo",
        },
        { name: item.name },
      )}
      thumbnailHeight={150}
      onClick={() => onClick(item)}
    />
  );
};
