import {
  Box,
  Button,
  Link,
  MultilineInput,
  Rows,
  Slider,
  SortIcon,
  Text,
  Title,
} from "@canva/app-ui-kit";
import * as React from "react";
import * as styles from "styles/components.css";
import { FormattedMessage, useIntl } from "react-intl";
import type {
  OpenExternalUrlRequest,
  OpenExternalUrlResponse,
} from "@canva/platform";

const DOCS_URL = "https://canva.dev/docs/apps/localization";
const NAME = "Anto";

export const App = ({
  requestOpenExternalUrl,
}: {
  requestOpenExternalUrl: (
    request: OpenExternalUrlRequest,
  ) => Promise<OpenExternalUrlResponse>;
}) => {
  const openExternalUrl = async (url: string) => {
    const response = await requestOpenExternalUrl({
      url,
    });

    if (response.status === "aborted") {
      // user decided not to navigate to the link
    }
  };
  const intl = useIntl();
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* ==================== Basic message ==================== */}
        <Title size="small">
          <FormattedMessage
            /**
             * The defaultMessage string is used as the source of translations. Should be written in English (US).
             * This is also displayed to users with an English locale, or a locale for which no translations
             * can be found.
             */
            defaultMessage="My internationalized app"
            /**
             * Use the description string to convey as much context as possible to a human translator.
             * For guidance on writing translator notes, see here: https://canva.dev/docs/apps/localization/#add-notes-for-translators
             */
            description="This is the title of the app that the user sees when they open it. Appears at the top of the page."
          />
        </Title>
        {/* ==================== Interpolation ==================== */}
        <Text>
          <FormattedMessage
            defaultMessage="Welcome to the world of AI creativity, {firstName}!"
            description="Greeting to welcome the user to the AI image generation app"
            values={{
              firstName: NAME,
            }}
          />
        </Text>
        {/* ==================== Numbers ==================== */}
        <Text>
          <FormattedMessage
            defaultMessage="Image generation is {progress, number, ::percent} complete."
            description="Displays the progress of the current image generation task that the user has requested"
            values={{
              progress: 0.75,
            }}
          />
        </Text>
        {/* ==================== Date and time formatting ==================== */}
        <Text>
          <FormattedMessage
            defaultMessage="Credits refresh on: {refreshDate, date, short} at {refreshTime, time, short}"
            description="Informs users when their credits for image generation will refresh, including the time"
            values={{
              refreshDate: nextWeek,
              refreshTime: nextWeek,
            }}
          />
        </Text>
        {/* ==================== Plurals ==================== */}
        <CreditUsage creditsCost={5} remainingCredits={50} />
        <CreditUsage creditsCost={1} remainingCredits={1} />
        <CreditUsage creditsCost={1} remainingCredits={0} />
        {/* ==================== Rich Text ==================== */}
        <FormattedMessage
          defaultMessage="Discover stunning AI-generated example images in our <link>gallery</link> and <callToAction>start exploring now!</callToAction>"
          description="A call to action directing the user to explore the AI image gallery"
          values={{
            link: (chunks) => (
              <Link
                href={DOCS_URL}
                requestOpenExternalUrl={() => openExternalUrl(DOCS_URL)}
              >
                {chunks}
              </Link>
            ),
            callToAction: (chunks) => <strong>{chunks}</strong>,
          }}
        >
          {(chunks) => <Text>{chunks}</Text>}
        </FormattedMessage>
        {/* ==================== Message as string type ==================== */}
        <Button variant="primary">
          {intl.formatMessage({
            defaultMessage: "Generate image",
            description: "A button label to generate an image from a prompt",
          })}
        </Button>
        {/* ==================== Non-visible text usage (aria-label) ==================== */}
        <Button
          variant="primary"
          icon={SortIcon}
          ariaLabel={intl.formatMessage({
            defaultMessage: "Sort images by creation date (Newest to Oldest)",
            description:
              "Screenreader text for a button. When pressed, the button will sort the generated images by creation date from newest to oldest.",
          })}
        />
        {/* ==================== Component that changes between LTR and RTL languages ==================== */}
        <Box paddingStart="2u">
          <Slider min={0} max={100} />
        </Box>
        {/* ==================== List formatting ==================== */}
        <SelectedEffects />
        {/* ==================== Relative time formatting ==================== */}
        <LastGeneratedMessage lastGeneratedTime={now} />
        {/* ==================== Display name formatting ==================== */}
        <Text>
          <FormattedMessage
            defaultMessage="You are currently viewing this app in {language}"
            description="Informs the user about the language in which they are viewing the app"
            values={{
              language: intl.formatDisplayName(intl.locale, {
                type: "language",
              }),
            }}
          />
        </Text>
        {/* ==================== Multiline Example ==================== */}
        <Text>
          <FormattedMessage
            defaultMessage="This is a multi-line {breakingLine}text example!"
            description="An example text block that carries over multiple lines."
            values={{
              breakingLine: <br />,
            }}
          />
        </Text>
        <MultilineInput
          minRows={2}
          maxRows={2}
          autoGrow={false}
          placeholder={intl.formatMessage(
            {
              description:
                "Placeholder text to a MultilineInput that carries over multiple lines.",
              defaultMessage: `This is a multi {breakingLine}line input example!`,
            },
            {
              breakingLine: "\n",
            },
          )}
        />
      </Rows>
    </div>
  );
};

export const CreditUsage = ({
  creditsCost,
  remainingCredits,
}: {
  creditsCost: number;
  remainingCredits: number;
}) => (
  <Text>
    <FormattedMessage
      defaultMessage={`Use {creditsCost, number} of {remainingCredits, plural,
        one {# credit}
        other {# credits}
      }`}
      description="Informs the user about the number of credits they will use for the image generation task. Appears below the image generation button."
      values={{
        creditsCost,
        remainingCredits,
      }}
    />
  </Text>
);

const SelectedEffects = () => {
  const intl = useIntl();

  // TODO: Make this list change based on user selection!
  const selectedEffects = [
    intl.formatMessage({
      defaultMessage: "black and white",
      description:
        "An option that when selected, will apply a black and white effect to the generated image",
    }),
    intl.formatMessage({
      defaultMessage: "high contrast",
      description:
        "An option that when selected, will apply a high contrast effect to the generated image",
    }),
    intl.formatMessage({
      defaultMessage: "cartoon",
      description:
        "An option that when selected, will apply a cartoon effect to the generated image",
    }),
  ];

  return (
    <Text>
      <FormattedMessage
        defaultMessage="You have selected the following image effects: {effects}"
        description="Informs the user about the image effects they have selected. effects is a list of effects that will be applied to the generated image."
        values={{
          effects: intl.formatList(selectedEffects, {
            type: "conjunction",
          }),
        }}
      />
    </Text>
  );
};

const LastGeneratedMessage = ({
  lastGeneratedTime,
}: {
  lastGeneratedTime: Date;
}) => {
  const intl = useIntl();

  const [generatedTimeAgoInSeconds, setGeneratedTimeAgoInSeconds] =
    React.useState(
      Math.floor((new Date().getTime() - lastGeneratedTime.getTime()) / 1000),
    );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGeneratedTimeAgoInSeconds(
        Math.floor((new Date().getTime() - lastGeneratedTime.getTime()) / 1000),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [lastGeneratedTime]);

  return (
    <Text>
      <FormattedMessage
        defaultMessage="Last image generated {timeAgo}"
        description="Tells the user how long ago they generated their last image. timeAgo is a relative time string. e.g. '5 seconds ago'"
        values={{
          timeAgo: intl.formatRelativeTime(
            -generatedTimeAgoInSeconds,
            "seconds",
          ),
        }}
      />
    </Text>
  );
};
