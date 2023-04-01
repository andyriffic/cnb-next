import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Heading, PrimaryButton } from "../../../components/Atoms";
import { CenterSpaced } from "../../../components/Layouts";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { fetchCreateAiOverlordGame } from "../../../utils/api";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const [creatingGame, setCreatingGame] = useState(false);

  const createGame = useCallback(() => {
    setCreatingGame(true);
    fetchCreateAiOverlordGame({
      opponents: [
        { playerId: "andy", name: "Andy", occupation: "Lead Developer" },
        { playerId: "marion", name: "Marion", occupation: "Product Manager" },
        { playerId: "nina", name: "Nina", occupation: "Delivery Lead" },
        { playerId: "kate", name: "Kate", occupation: "UX Designer" },
      ],
    }).then((game) => {
      console.log("Created game: ", game);
      setTimeout(() => {
        router.push(`/watch/ai-overlord/${game.gameId}`);
      }, 100);
    });
  }, [router]);

  return (
    <SpectatorPageLayout>
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <CenterSpaced>
        <div style={{ margin: "2rem 0" }}>
          <PrimaryButton onClick={createGame} disabled={creatingGame}>
            {creatingGame ? "Initialising AI" : "Create game"}
          </PrimaryButton>
        </div>
      </CenterSpaced>
    </SpectatorPageLayout>
  );
}

export default Page;
