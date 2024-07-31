import { Box, Button, Columns, HelpCircleIcon, Placeholder, PlusIcon, RotateIcon, Rows, Text, Title } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import React, { useState } from "react";
import styles from "styles/components.css";
import { ChooseColours } from "./ChooseColours";
import { ScoreComponent } from "./ScoreComponent";

export const App = () => {
  const [showComponents, setShowComponents] = useState(false);
  const [fgColour, setFgColour] = useState("#FFFFFF");
  const [bgColour, setBgColour] = useState("#000000");

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
      <Rows spacing="2u">
        <ChooseColours 
          fgColour={fgColour} 
          bgColour={bgColour} 
          onChangeFgColour={setFgColour} 
          onChangeBgColour={setBgColour} 
          onClick={onClick} 
        />
        <Button variant="primary" stretch={true} onClick={toggleScore}>
          Calculate contrast score
        </Button>
        {showComponents && <ScoreComponent fgColour={fgColour} bgColour={bgColour} />}
      </Rows>
    </div>
  );
};
