import { Button, Rows, Text, Title } from "@canva/app-ui-kit";

type HomePageProps = {
  enterInteractionPage: () => void;
};

/**
 * Home Page component containing page controls
 **/
export const HomePage = (props: HomePageProps) => {
  return (
    <Rows spacing="1.5u">
      <Title>Home page</Title>
      <Text>
        This example app demonstrates how to toggle interactive UI based on the
        currently available features.
      </Text>
      <Button variant="primary" onClick={props.enterInteractionPage}>
        Enter interactions page
      </Button>
    </Rows>
  );
};
