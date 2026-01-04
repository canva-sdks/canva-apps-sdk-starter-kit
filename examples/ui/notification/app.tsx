// For usage information, see the README.md file.
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { notification } from "@canva/platform";
import * as styles from "styles/components.css";

export const App = () => {
  // Static demonstration messages for example purposes
  const funMessages = [
    "🚀 Keep going, superstar!",
    "💪 You got this!",
    "🌟 Shine bright!",
    "🔥 Crushing it!",
    "🏆 Winner vibes only!",
  ];

  const handleClick = () => {
    const randomMessage =
      funMessages[Math.floor(Math.random() * funMessages.length)];
    notification.addToast({
      messageText: randomMessage || "🎲 Random notification!",
    });
  };
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <Text>Apps can trigger notifications:</Text>
        <Button variant="primary" onClick={handleClick}>
          Show a fun toast notification 🍞
        </Button>
      </Rows>
    </div>
  );
};
