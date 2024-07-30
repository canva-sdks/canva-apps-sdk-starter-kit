import { Box, Button, Columns, HelpCircleIcon, Placeholder, PlusIcon, RotateIcon, Rows, Text, Title } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import React, { useState } from "react";
import styles from "styles/components.css";
import { ChooseColours } from "./chooseColours";
import { ScoreComponent } from "./ScoreComponent";

export const App = () => {
  const [showComponents, setShowComponents] = useState(false);

  const onClick = () => {
    addNativeElement({
      type: "TEXT",
      children: ["Hello world!"],
    });
  };

  const toggleScore = () => {
    setShowComponents(true);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1.5u">
        <ChooseColours label="Foreground" fgColour ="#FFFFFF" bgColour ="#000000" onClick={onClick} />
        <Button variant="primary" stretch={true} onClick={toggleScore}>
          Calculate contrast score
        </Button>
      </Rows>

      {showComponents && <ScoreComponent />}
    </div>
  );
};
