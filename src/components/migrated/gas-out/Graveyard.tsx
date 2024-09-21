import styled from "styled-components";
import Image from "next/image";
import { slideInUpAnimation } from "../../animations/keyframes/slideInBlurredTop";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { GraveyardPlayer } from "./GraveyardPlayer";

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
`;

const GraveyardPlayerContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const GraveyardPlayerItem = styled.div`
  animation: ${slideInUpAnimation} 600ms linear 1000ms both;
`;

type Props = {
  game: GasGame;
};

const sortByFinishPositionDesc = (a: GasPlayer, b: GasPlayer) =>
  (b.finishedPosition || 0) - (a.finishedPosition || 0);

export function Graveyard({ game }: Props): JSX.Element {
  return (
    <Container>
      <div style={{ position: "relative" }}>
        <Image
          src="/images/gas-out/tombstone.png"
          alt="tombstone"
          width={100}
          height={100}
        />
      </div>
      <GraveyardPlayerContainer>
        {game.allPlayers
          .filter((p) => p.status === "dead")
          .sort(sortByFinishPositionDesc)
          .map((p) => {
            return (
              <GraveyardPlayerItem key={p.player.id}>
                <GraveyardPlayer player={p} game={game} />
              </GraveyardPlayerItem>
            );
          })}
      </GraveyardPlayerContainer>
    </Container>
  );
}
