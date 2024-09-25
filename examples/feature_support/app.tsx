import { addElementAtPoint, addPage } from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";
import { useFeatureSupport } from "utils/use_feature_support";
import { HomePage } from "./home";
import { InteractionPage } from "./interaction";

type AppPage = "home" | "interaction";

/**
 * Top-level component that manages state across the example app.
 **/
export const App = () => {
  const [appPage, setAppPage] = useState<AppPage>("home");

  // A new callback is returned each time the feature support profile of the
  // current page changes in Canva.
  const isSupported = useFeatureSupport();

  // Check whether `addElementAtPoint` and `addPage` are supported in the current page.
  const isInteractionSupported = isSupported(addElementAtPoint, addPage);

  const renderPage = (page: AppPage) => {
    switch (page) {
      case "home":
        return (
          <HomePage enterInteractionPage={() => setAppPage("interaction")} />
        );
        break;
      case "interaction":
        return (
          <InteractionPage
            goBack={() => setAppPage("home")}
            isInteractionSupported={isInteractionSupported}
          />
        );
      default:
        return;
    }
  };

  return <div className={styles.scrollContainer}>{renderPage(appPage)}</div>;
};
