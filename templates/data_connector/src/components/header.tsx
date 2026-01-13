import {
  ArrowLeftIcon,
  Box,
  Button,
  Column,
  Columns,
  Title,
} from "@canva/app-ui-kit";
import { useNavigate } from "react-router-dom";
import { Paths } from "src/routes/paths";

export const Header = ({
  title,
  showBack,
}: {
  title: string;
  showBack: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Box paddingBottom="1u">
      <Columns spacing="0" alignY="center" align="start">
        {showBack && (
          <Column width="content">
            <Button
              onClick={() => navigate(Paths.DATA_SOURCE_SELECTION)}
              icon={ArrowLeftIcon}
              variant="tertiary"
            />
          </Column>
        )}
        <Column>
          <Title size="small" lineClamp={1}>
            {title}
          </Title>
        </Column>
      </Columns>
    </Box>
  );
};
