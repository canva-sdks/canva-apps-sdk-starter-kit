import { Button, Rows, FileInput, Text } from "@canva/app-ui-kit";
import { ImageMimeType } from "@canva/asset";
import * as React from "react";
import styles from "styles/components.css";

const COLORIZER_URL =
  "https://lpfsetcdtc.execute-api.us-east-1.amazonaws.com/invocations";

/**
 * Represents an image that has been colorized.
 */
type ColorizedImage = {
  /** A unique identifier for the image. */
  id: string;

  /** The URL where the full-sized colorized image can be accessed. */
  url: string;

  /** The URL where a thumbnail version of the colorized image can be accessed. */
  thumbnailUrl: string;

  /** The MIME type of the image. */
  mimeType: ImageMimeType;
};

/**
 * Represents a file that has been provided as input.
 */
type InputFile = {
  /** The name of the input file. */
  name: string;

  /** The Data URI representing the file's data. */
  dataUri: string;
};

/**
 * Converts a File object to a Base64-encoded string.
 *
 * @param file - The File object to be converted.
 * @returns A promise that resolves to a Base64-encoded string.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error(`Unable to read file: ${file.name}`));

    reader.readAsDataURL(file);
  });
}

export const App = () => {
  const [file, setFile] = React.useState<InputFile | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [colorizedImageUrl, setColorizedImageUrl] = React.useState<
    string | undefined
  >();

  const colorize = async () => {
    if (!file) {
      return;
    }
    setIsLoading(true);

    // TODO: Make fetch API call to get colorized image

    // TODO: Set colorized image URL

    // TODO: Upload asset to user library

    // TODO: Add to design

    setIsLoading(false);
  };

  const onDropAcceptedFiles = async ([file]: File[]) => {
    // TODO: Encode file to base64 and set file state
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          Drop your black and white images to bring them to life using our AI
          Powered Colorizer.
        </Text>
        <FileInput
          stretchButton
          accept={["image/png", "image/jpeg", "image/jpg"]}
          onDropAcceptedFiles={onDropAcceptedFiles}
          multiple={false}
        />
        {file && (
          <>
            {/** TODO: Preview selected file and image */}
          </>
        )}
        {colorizedImageUrl && (
          <>
            {/** TODO: Preview colorized image */}
          </>
        )}
        <Button
          variant="primary"
          onClick={colorize}
          loading={isLoading}
          stretch
        >
          Colorize
        </Button>
      </Rows>
    </div>
  );
};
