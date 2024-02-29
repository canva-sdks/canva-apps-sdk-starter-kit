import {
  Box,
  Button,
  ChevronDownIcon,
  FormField,
  Rows,
  Select,
  Text,
  TextInput,
  Title,
  SegmentedControl,
} from "@canva/app-ui-kit";
import {
  findFonts,
  Font,
  FontStyle,
  FontWeightName,
  requestFontSelection,
} from "@canva/asset";
import { addNativeElement } from "@canva/design";
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

const fontStyleOptions: {
  value: FontStyle;
  label: FontStyle;
  disabled?: boolean;
}[] = [
  { value: "normal", label: "normal", disabled: false },
  { value: "italic", label: "italic", disabled: false },
];

export const App = () => {
  const [textConfig, setTextConfig] = React.useState<TextConfig>(initialConfig);
  const [selectedFont, setSelectedFont] = React.useState<Font | undefined>(
    undefined
  );
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
  const availableFontWeights = getFontWeights(selectedFont);

  const availableFontStyles = getFontStyles(fontWeight, selectedFont);
  const availableStyleValues = new Set(
    availableFontStyles.map((style) => style.value)
  ); // Create a Set for lookup
  const availableFontStyleOptions = fontStyleOptions.map((styleOption) => {
    // Check if the current style option is NOT present in the available styles.
    if (!availableStyleValues.has(styleOption.value)) {
      // If so, return a new object with `disabled` set to true, keeping the rest of the object the same.
      return { ...styleOption, disabled: true };
    }
    // If the style is available, return it as is. Also ensures disabled is set to false explicitly if not already defined.
    return { ...styleOption, disabled: false };
  });

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
            value={selectedFont?.ref}
            control={(props) => (
              <Select
                {...props}
                stretch
                onChange={(ref) => {
                  const selected = availableFonts.find((f) => f.ref === ref);
                  setSelectedFont(selected);
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
          variant="secondary"
          icon={ChevronDownIcon}
          iconPosition="end"
          alignment="start"
          stretch={true}
          onClick={async () => {
            const response = await requestFontSelection({
              selectedFontRef: selectedFont?.ref,
            });
            if (response.type === "COMPLETED") {
              setSelectedFont(response.font);
              resetSelectedFontStyleAndWeight(response.font);
            }
          }}
          disabled={disabled}
        >
          {selectedFont?.name || "Select a font"}
        </Button>
        {selectedFont?.previewUrl && (
          <Box background="neutralLow" padding="2u" width="full">
            <Rows spacing="0" align="center">
              <img src={selectedFont.previewUrl} style={{ maxWidth: "100%" }} />
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
              disabled={!selectedFont || availableFontWeights.length === 0}
              options={availableFontWeights}
            />
          )}
        />
        <FormField
          label="Font style"
          value={fontStyle}
          control={(props) => (
            <SegmentedControl
              {...props}
              options={availableFontStyleOptions}
              value={fontStyle}
              onChange={(style) => {
                setTextConfig((prevState) => {
                  return {
                    ...prevState,
                    fontStyle: style,
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={() => {
            addNativeElement({
              type: "TEXT",
              ...textConfig,
              fontRef: selectedFont?.ref,
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
