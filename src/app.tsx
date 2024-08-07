import { Rows, Link, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";
import { ChooseColours } from "./ChooseColours";
import { ScoreComponent } from "./ScoreComponent";
import { RecommendationsComponent } from "./RecommendationsComponent";
import { calculateContrastHex, scorePass } from "./utils";
import { useState } from "react";

export const App = () => {
  const [fgColour, setFgColour] = useState("#FFFFFF");
  const [bgColour, setBgColour] = useState("#000000");

  const onClick = () => {
    addNativeElement({
      type: "TEXT",
      children: ["Hello world!"],
    });
  };

  const contrastScore = calculateContrastHex(fgColour, bgColour);

  const showRecommendations = !scorePass(contrastScore)

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <ChooseColours 
          fgColour={fgColour} 
          bgColour={bgColour} 
          onChangeFgColour={setFgColour} 
          onChangeBgColour={setBgColour} 
          onClick={onClick} 
        />
        <ScoreComponent fgColour={fgColour} bgColour={bgColour} contrastScore={contrastScore} />
        {showRecommendations && <RecommendationsComponent fgColour={fgColour} bgColour={bgColour} />}
        <Text size="medium">
            <Link
              href="https://contrast-mate-docs.super.site/"
              id="id"
              requestOpenExternalUrl={() => {}}
              title="Check out how Contrast Mate works"
            >
              Check out how Contrast Mate works
            </Link>
          </Text>
      </Rows>
    </div>
  );
};
