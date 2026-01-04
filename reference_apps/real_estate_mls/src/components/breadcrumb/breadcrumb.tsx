import {
  ArrowLeftIcon,
  Button,
  Column,
  Columns,
  Text,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import type { Office } from "../../real_estate.type";

export const Breadcrumb = () => {
  const office = (useLocation().state as { office: Office })?.office;
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <Columns spacing="1u" alignY="center">
      <Column width="content">
        <Button
          icon={ArrowLeftIcon}
          size="small"
          type="button"
          variant="tertiary"
          onClick={() => navigate("/entry")}
        />
      </Column>
      <Column>
        <Text variant="bold">
          {office
            ? office.name
            : intl.formatMessage({
                defaultMessage: "Back",
                description: "Back button",
              })}
        </Text>
      </Column>
    </Columns>
  );
};
