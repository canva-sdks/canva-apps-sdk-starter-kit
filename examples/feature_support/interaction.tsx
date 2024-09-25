import { Alert, Button, Rows } from "@canva/app-ui-kit";
import { addElementAtPoint, addPage } from "@canva/design";

type InteractionPageProps = {
  goBack: () => void;
  isInteractionSupported: boolean;
};

/**
 * A page component containing various buttons to interact with the design.
 **/
export const InteractionPage = (props: InteractionPageProps) => {
  return (
    <Rows spacing="1.5u">
      {!props.isInteractionSupported && <UnsupportedAlert />}
      <Button variant="primary" onClick={props.goBack}>
        Back
      </Button>
      <Button
        disabled={!props.isInteractionSupported}
        variant="secondary"
        onClick={() => addElementAtPoint({ type: "shape", ...shape })}
      >
        Add a shape at a point
      </Button>
      <Button
        disabled={!props.isInteractionSupported}
        variant="secondary"
        onClick={() =>
          addElementAtPoint({
            type: "group",
            children: [
              {
                type: "shape",
                ...shape,
                left: 0,
                top: 0,
                width: 200,
                height: "auto",
              },
              {
                type: "embed",
                url: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
                left: 300,
                top: 100,
                width: 200,
                height: "auto",
              },
            ],
          })
        }
      >
        Add a group at a point
      </Button>
      <Button
        disabled={!props.isInteractionSupported}
        variant="secondary"
        onClick={() => addPage()}
      >
        Add a new page
      </Button>
    </Rows>
  );
};

const shape = {
  paths: [
    {
      d: "M 0 0 H 100 V 100 H 0 L 0 0",
      fill: {
        dropTarget: false,
        color: "#ff0099",
      },
    },
  ],
  viewBox: {
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  },
};

const UnsupportedAlert = () => (
  <Alert tone="warn" title="Shapes, Groups and Pages can't be added to Docs.">
    Try using this app in a different design type.
  </Alert>
);
