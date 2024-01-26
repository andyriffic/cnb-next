import type { NextPage } from "next";
import { BalloonCard } from "../components/migrated/gas-out/BalloonCard";
import { css } from "../../styled-system/css";

const Home: NextPage = () => {
  return (
    <div>
      <div>
        <h2 className={css({ fontWeight: "bold", color: "blue" })}>
          Balloon game cards
        </h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          hello
        </div>
        <BalloonCard card={{ presses: 6, type: "bomb" }} pressesRemaining={4} />
      </div>
    </div>
  );
};

export default Home;
