import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import React from "react";
import "./preview.css";

type Theme = "light" | "dark";

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
          {/* https://github.com/storybookjs/storybook/issues/15223#issuecomment-1092837912 */}
          {Story(context)}
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
          { title: "Light", value: "light" as Theme },
          { title: "Dark", value: "dark" as Theme },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
