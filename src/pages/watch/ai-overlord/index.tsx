import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Heading, PrimaryButton, SubHeading } from "../../../components/Atoms";
import { CenterSpaced } from "../../../components/Layouts";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import { fetchCreateAiOverlordGame } from "../../../utils/api";
import { generateShortNumericId } from "../../../utils/id";
import { getAiOverlordSpectatorUrl } from "../../../utils/url";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const [creatingGame, setCreatingGame] = useState(false);
  const { aiOverlord } = useSocketIo();

  const createGame = useCallback(() => {
    setCreatingGame(true);
    aiOverlord.createAiOverlordGame(
      generateShortNumericId(),
      [
        { playerId: "andy", name: "Andy", occupation: "Lead Developer" },
        { playerId: "marion", name: "Marion", occupation: "Product Manager" },
        { playerId: "nina", name: "Nina", occupation: "Delivery Lead" },
        { playerId: "kate", name: "Kate", occupation: "UX Designer" },
      ],
      (gameId) => {
        router.push(getAiOverlordSpectatorUrl(gameId));
        // setCreatingGame(false);
      }
    );
  }, [aiOverlord, router]);

  return (
    <SpectatorPageLayout>
      <CenterSpaced stacked={true}>
        <Heading style={{ marginTop: "2rem" }}>AI Overlord!</Heading>
        <div style={{ margin: "2rem 0" }}>
          <PrimaryButton
            type="button"
            onClick={createGame}
            disabled={creatingGame}
          >
            {creatingGame ? "Initialising AI" : "Create game"}
          </PrimaryButton>
        </div>
        <SubHeading style={{ marginTop: "2rem" }}>Other games</SubHeading>
        <div>
          {aiOverlord.aiOverlordGames.map((game) => (
            <div key={game.gameId}>
              <Link href={getAiOverlordSpectatorUrl(game.gameId)}>
                {game.gameId}
              </Link>
            </div>
          ))}
        </div>
      </CenterSpaced>
    </SpectatorPageLayout>
  );
}

export default Page;
