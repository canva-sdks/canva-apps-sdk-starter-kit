import { Box, Rows } from "@canva/app-ui-kit";
import { Outlet } from "react-router-dom";
import * as styles from "styles/components.css";
import { AppError } from "../../components";

export const Home = () => (
  <div className={styles.scrollContainer}>
    <Box
      justifyContent="center"
      width="full"
      alignItems="start"
      display="flex"
      height="full"
    >
      <Rows spacing="3u">
        <AppError />
        <Outlet />
      </Rows>
    </Box>
  </div>
);
