import type { Preview } from "@storybook/react";
import "@canva/app-ui-kit/styles.css";
import React from "react";
import { themes } from "@storybook/theming";
import "./preview.css";
import { AppUiProvider } from "@canva/app-ui-kit";

type theme = "light" | "dark";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: themes.dark,
    },
    backgrounds: { disable: true },
  },
  decorators: [
    (Story, context) => {
      const mockUiContext = {
        theme: context.globals.theme,
      };

      window["__canva__"] = {
        uiKit: {
          getUiContext: () => new Promise((resolve) => resolve(mockUiContext)),
          onUiContextChange: () => 0,
        },
      };

      return (
        <AppUiProvider>
          <Story />
        </AppUiProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        items: [
          { title: "Light", value: "light" as theme },
          { title: "Dark", value: "dark" as theme },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
