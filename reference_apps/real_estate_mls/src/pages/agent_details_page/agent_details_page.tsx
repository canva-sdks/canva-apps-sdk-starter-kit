import {
  ArrowLeftIcon,
  Box,
  Button,
  Column,
  Columns,
  ImageCard,
  Rows,
  Text,
  TypographyCard,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import type { Agent } from "../../real_estate.type";
import { useAddElement } from "../../util/use_add_element";
import { useDragElement } from "../../util/use_drag_element";

export const AgentDetailsPage = () => {
  const navigate = useNavigate();
  const agent = (useLocation().state as { agent: Agent })?.agent;
  const intl = useIntl();

  const { addText, addImage } = useAddElement();

  const { dragText, dragImage } = useDragElement();

  if (!agent) {
    navigate(-1);
  }

  return (
    <Box paddingY="2u" height="full">
      <Rows spacing="2u">
        <Columns spacing="1u" alignY="center">
          <Column width="content">
            <Button
              icon={ArrowLeftIcon}
              size="small"
              type="button"
              variant="tertiary"
              onClick={() => navigate(-1)}
            />
          </Column>
          <Column>
            <Text variant="bold">
              {intl.formatMessage({
                defaultMessage: "Agent Details",
                description: "Page title for agent details page",
              })}
            </Text>
          </Column>
        </Columns>

        <Rows spacing="2u">
          {agent.headshots && (
            <Box>
              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Headshots",
                    description: "Label for agent headshots section",
                  })}
                </Text>
                <Columns spacing="2u" alignY="stretch">
                  {agent.headshots.map((headshot, index) => (
                    <Column key={index} width="1/2">
                      <ImageCard
                        selectable
                        thumbnailUrl={headshot.url}
                        alt={intl.formatMessage({
                          defaultMessage: "Agent photo",
                          description: "Alt text for agent photo",
                        })}
                        thumbnailHeight={150}
                        onClick={async () => {
                          await addImage(
                            headshot.url,
                            intl.formatMessage({
                              defaultMessage: "Agent photo",
                              description: "Alt text for agent photo",
                            }),
                          );
                        }}
                        onDragStart={(e) => {
                          dragImage(
                            e,
                            headshot.url,
                            intl.formatMessage({
                              defaultMessage: "Agent photo",
                              description: "Alt text for agent photo",
                            }),
                            headshot.width,
                            headshot.height,
                          );
                        }}
                      />
                    </Column>
                  ))}
                </Columns>
              </Rows>
            </Box>
          )}

          <Rows spacing="2u">
            <Box>
              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Name",
                    description: "Label for agent name field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add agent name to design",
                    description:
                      "Accessibility label for adding agent name to design",
                  })}
                  onClick={() => addText(agent.name)}
                  onDragStart={(e) => dragText(e, agent.name)}
                >
                  <Text>{agent.name}</Text>
                </TypographyCard>
              </Rows>
            </Box>

            <Box>
              <Rows spacing="1u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Title",
                    description: "Label for agent role title field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add agent title to design",
                    description:
                      "Accessibility label for adding agent title to design",
                  })}
                  onClick={() => addText(agent.roleTitle || "")}
                  onDragStart={(e) => dragText(e, agent.roleTitle || "")}
                >
                  <Text>{agent.roleTitle}</Text>
                </TypographyCard>
              </Rows>
            </Box>

            <Box>
              <Rows spacing="0.5u">
                <Text variant="bold">
                  {intl.formatMessage({
                    defaultMessage: "Phone number",
                    description: "Label for agent phone number field",
                  })}
                </Text>
                <TypographyCard
                  ariaLabel={intl.formatMessage({
                    defaultMessage: "Add agent phone to design",
                    description:
                      "Accessibility label for adding agent phone to design",
                  })}
                  onClick={() => addText(agent.phoneNumber || "")}
                  onDragStart={(e) => dragText(e, agent.phoneNumber || "")}
                >
                  <Text>{agent.phoneNumber}</Text>
                </TypographyCard>
              </Rows>
            </Box>
          </Rows>
        </Rows>
      </Rows>
    </Box>
  );
};
