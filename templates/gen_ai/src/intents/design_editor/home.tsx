import { Rows } from "@canva/app-ui-kit";
import { Outlet } from "react-router-dom";
import * as styles from "styles/components.css";
import { Footer } from "../../components";

export const Home = () => (
  <div className={styles.scrollContainer}>
    <Rows spacing="3u">
      <Outlet />
      <Footer />
    </Rows>
  </div>
);
