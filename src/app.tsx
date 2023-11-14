import {
  Button,
  Rows,
  FileInput,
  Text,
  FileInputItem,
  Title,
} from "@canva/app-ui-kit";
import { ImageMimeType, upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";
import { auth } from "@canva/user";
import * as React from "react";
import styles from "styles/components.css";

const COLORIZER_URL =
  "https://r2ntk9rpq0.execute-api.us-east-1.amazonaws.com/invocations";

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

    const token = await auth.getCanvaUserToken();

    // TODO: Make fetch API call to get colorized image
    const response = await fetch(COLORIZER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dataUri: file.dataUri }),
    });

    const { id, mimeType, thumbnailUrl, url }: ColorizedImage =
      await response.json();

    // TODO: Set colorized image URL
    setColorizedImageUrl(url);

    // TODO: Upload asset to user library
    const result = await upload({
      type: "IMAGE",
      id,
      mimeType,
      thumbnailUrl,
      url,
    });

    // TODO: Add to design
    await addNativeElement({
      type: "IMAGE",
      ref: result.ref,
    });

    setIsLoading(false);
  };

  const onDropAcceptedFiles = async ([file]: File[]) => {
    // TODO: Encode file to base64 and set file state
    const dataUri = await fileToBase64(file);

    setFile({
      dataUri,
      name: file.name,
    });

    setColorizedImageUrl(undefined);
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
            <FileInputItem
              label={file.name}
              onDeleteClick={() => {
                setFile(undefined);
                setColorizedImageUrl(undefined);
              }}
            />
            <Title>Original:</Title>
            <img src={file.dataUri} alt={file.name} />
          </>
        )}
        {colorizedImageUrl && (
          <>
            <Title>Colorized:</Title>
            <img src={colorizedImageUrl} alt={file!.name} />
          </>
        )}
        <Button
          variant="primary"
          onClick={colorize}
          loading={isLoading}
          disabled={file === undefined}
          stretch
        >
          Colorize
        </Button>
      </Rows>
    </div>
  );
};
