import {
  Box,
  Button,
  FormField,
  Rows,
  Select,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import {
  findFonts,
  Font,
  FontStyle,
  FontWeightName,
  requestFontSelection,
} from "@canva/preview/asset";
import { addNativeElement } from "@canva/preview/design";
import React, { useEffect } from "react";
import styles from "styles/components.css";

type TextConfig = {
  text: string;
  color: string;
  fontWeight: FontWeightName;
  fontStyle: FontStyle;
};

const initialConfig: TextConfig = {
  text: "Hello world",
  color: "#8B3DFF",
  fontWeight: "normal",
  fontStyle: "normal",
};

export const App = () => {
  const [textConfig, setTextConfig] = React.useState<TextConfig>(initialConfig);
  const [font, setFont] = React.useState<Font | undefined>(undefined);
  const [availableFonts, setAvailableFonts] = React.useState<readonly Font[]>(
    []
  );

  const fetchFonts = React.useCallback(async () => {
    const response = await findFonts();
    setAvailableFonts(response.fonts);
  }, [setAvailableFonts]);

  useEffect(() => {
    fetchFonts();
  }, [fetchFonts]);

  const { text, fontWeight, fontStyle } = textConfig;
  const disabled = text.trim().length === 0;
  const availableFontStyles = getFontStyles(fontWeight, font);
  const availableFontWeights = getFontWeights(font);

  const resetSelectedFontStyleAndWeight = (selectedFont?: Font) => {
    setTextConfig((prevState) => {
      return {
        ...prevState,
        fontStyle:
          getFontStyles(fontWeight, selectedFont)[0]?.value || "normal",
        fontWeight: getFontWeights(selectedFont)[0]?.value || "normal",
      };
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can apply fonts to text elements
          and add to design.
        </Text>
        <FormField
          label="Text"
          value={text}
          control={(props) => (
            <TextInput
              {...props}
              onChange={(value) => {
                setTextConfig((prevState) => {
                  return {
                    ...prevState,
                    text: value,
                  };
                });
              }}
            />
          )}
        />
        <Title size="small">Font selection</Title>
        {availableFonts.length > 0 && (
          <FormField
            label="Font family"
            value={font?.ref}
            control={(props) => (
              <Select
                {...props}
                stretch
                onChange={(ref) => {
                  const selected = availableFonts.find((f) => f.ref === ref);
                  setFont(selected);
                  resetSelectedFontStyleAndWeight(selected);
                }}
                options={availableFonts.map((f) => ({
                  value: f.ref,
                  label: f.name,
                }))}
              />
            )}
          />
        )}
        <Button
          variant="primary"
          onClick={async () => {
            const response = await requestFontSelection();
            if (response.type === "COMPLETED") {
              setFont(response.font);
              resetSelectedFontStyleAndWeight(response.font);
            }
          }}
          disabled={disabled}
          stretch
        >
          Open font family panel
        </Button>
        {font?.previewUrl && (
          <Box background="neutralLow" padding="2u" width="full">
            <Rows spacing="0" align="center">
              <img src={font.previewUrl} style={{ maxWidth: "100%" }} />
            </Rows>
          </Box>
        )}
        <Title size="small">Font options</Title>
        <FormField
          label="Font weight"
          value={fontWeight}
          control={(props) => (
            <Select
              {...props}
              stretch
              onChange={(fontWeight) => {
                setTextConfig((prevState) => {
                  return {
                    ...prevState,
                    fontWeight: fontWeight,
                  };
                });
              }}
              disabled={!font || availableFontWeights.length === 0}
              options={availableFontWeights}
            />
          )}
        />
        <FormField
          label="Font style"
          value={fontStyle}
          control={(props) => (
            <Select
              {...props}
              stretch
              onChange={(style) => {
                setTextConfig((prevState) => {
                  return {
                    ...prevState,
                    fontStyle: style,
                  };
                });
              }}
              disabled={!font || availableFontStyles.length === 0}
              options={availableFontStyles}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={() => {
            addNativeElement({
              type: "TEXT",
              ...textConfig,
              fontRef: font?.ref,
              children: [textConfig.text],
            });
          }}
          disabled={disabled}
          stretch
        >
          Add text element
        </Button>
      </Rows>
    </div>
  );
};

const getFontWeights = (
  font?: Font
): {
  value: FontWeightName;
  label: FontWeightName;
}[] => {
  return font
    ? font.weights.map((w) => ({
        value: w.weight,
        label: w.weight,
      }))
    : [];
};

const getFontStyles = (
  fontWeight: FontWeightName,
  font?: Font
): {
  value: FontStyle;
  label: FontStyle;
}[] => {
  return font
    ? font.weights
        .find((w) => w.weight === fontWeight)
        ?.styles.map((s) => ({ value: s, label: s })) ?? []
    : [];
};
