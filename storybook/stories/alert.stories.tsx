import { Rows } from "@canva/app-ui-kit";
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Alert } from "../index";

const meta: Meta<typeof Alert> = {
  title: "@canva/app-ui-kit/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    tone: "positive",
    children: "This is an Alert.",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const SimpleAlert: Story = {};

/**
 * Positive alerts are used to notify the user that a successful action has taken place.
 */
export const PrimaryAlert = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Alert tone="positive">Alert</Alert>
      <Alert tone="positive" title="This is the title.">
        Alert with a title.
      </Alert>
      <Alert tone="positive" onDismiss={() => console.log("dismiss clicked")}>
        Dismissible alert
      </Alert>
    </Rows>
  );
};

/**
 * Info alerts are used to inform the user of neutral information.
 */
export const InformationalAlert = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Alert tone="info">Alert</Alert>
      <Alert tone="info" title="This is the title.">
        Alert with a title.
      </Alert>
      <Alert tone="info" onDismiss={() => console.log("dismiss clicked")}>
        Dismissible alert
      </Alert>
    </Rows>
  );
};

/**
 * Warning alerts are used to notify the user that an error has occurred, though they may proceed without rectifying anything.
 */
export const WarningAlert = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Alert tone="warn">Alert</Alert>
      <Alert tone="warn" title="This is the title.">
        Alert with a title.
      </Alert>
      <Alert tone="warn" onDismiss={() => console.log("dismiss clicked")}>
        Dismissible alert
      </Alert>
    </Rows>
  );
};

/**
 * Critical alerts are used to notify the user that and error has occurred which requires their attention before they may proceed,
 * or if the user's action will result in deletion of data.
 */
export const CriticalAlert = (_) => {
  return (
    <Rows spacing={"1u"}>
      <Alert tone="critical">Alert</Alert>
      <Alert tone="critical" title="This is the title.">
        Alert with a title.
      </Alert>
      <Alert tone="critical" onDismiss={() => console.log("dismiss clicked")}>
        Dismissible alert
      </Alert>
    </Rows>
  );
};
