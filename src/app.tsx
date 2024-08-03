import { Button, Rows } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";
import { ChooseColours } from "./ChooseColours";
import { ScoreComponent } from "./ScoreComponent";
import { RecommendationsComponent } from "./RecommendationsComponent";
import { Color } from "@canva/preview/asset";
import { calculateContrastHex, scorePass } from "./utils";
import { useState } from "react";

export const App = () => {
  const [fgColour, setFgColour] = useState("#FFFFFF");
  const [bgColour, setBgColour] = useState("#000000");
  const fgRecoms: Color[] = [
    { type: "solid", hexString: "#FFFFFF" }
  ];
  const bgRecoms: Color[] = [
    { type: "solid", hexString: "#000000" }
  ];

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
        {showRecommendations && <RecommendationsComponent fgRecoms={fgRecoms} bgRecoms={bgRecoms} />}
      </Rows>
    </div>
  );
};
