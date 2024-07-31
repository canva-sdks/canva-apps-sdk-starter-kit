import React from "react";
import styles from "styles/components.css";

type ShowcaseComponentProps = {
  fgColour: string;
  bgColour: string;
};

export const ShowcaseComponent: React.FC<ShowcaseComponentProps> = ({ fgColour, bgColour }) => (
  <div className={styles.bgContainer} style={{ backgroundColor: bgColour }}>
    <h3 className={styles.fgText} style={{ color: fgColour }}>
      Aa
    </h3>
  </div>
);
