import { useMemo } from "react";
import styled from "styled-components";
import { FONT_FAMILY } from "../../../colors";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { SubHeading } from "../../Atoms";
import { PlayerAvatar } from "../../PlayerAvatar";
import {
  fadeInDownAnimation,
  fadeInLeftAnimation,
} from "../../animations/keyframes/fade";
import { PlayerListPlayer } from "./PlayerListPlayer";

const Container = styled.div`
  margin-top: 150px;
  animation: ${fadeInDownAnimation} 1500ms ease-in-out 1s 1 both;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const PlacingContainer = styled.div`
  animation: ${fadeInLeftAnimation} 500ms ease-in-out 4s 1 both;
`;

const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Number = styled.div`
  font-size: 0.9rem;
  color: #222;
  font-family: ${FONT_FAMILY.numeric};
  text-align: center;
`;

type Props = {
  game: GasGame;
};

export function FinalPodium({ game }: Props): JSX.Element | null {
  const winningPlayer = useMemo(() => {
    return game.allPlayers.find((p) => p.player.id === game.winningPlayerId);
  }, [game]);

  const topGuessPlayers = useMemo(() => {
    if (!game.mvpPlayerIds) {
      return;
    }
    return game.allPlayers.filter(
      (p) =>
        !!game.mvpPlayerIds &&
        game.mvpPlayerIds.mostCorrectGuesses.includes(p.player.id)
    );
  }, [game]);

  const topPressPlayers = useMemo(() => {
    if (!game.mvpPlayerIds) {
      return;
    }

    return game.allPlayers.filter(
      (p) =>
        !!game.mvpPlayerIds &&
        game.mvpPlayerIds.mostPresses.includes(p.player.id)
    );
  }, [game]);

  if (!(topGuessPlayers && topPressPlayers && winningPlayer)) {
    return null;
  }

  return (
    <Container>
      <div>
        <PlayerListPlayer
          player={winningPlayer}
          game={game}
          gameOver={true}
          size="medium"
        />
      </div>
      <PlacingContainer>
        <SubHeading style={{ fontSize: "0.8rem" }}>Most Guesses</SubHeading>
        <Number>
          {topGuessPlayers[0] && topGuessPlayers[0].guesses.correctGuessCount}
        </Number>
        <PlayerContainer>
          {topGuessPlayers.map((p) => (
            <PlayerAvatar
              key={p.player.id}
              playerId={p.player.id}
              size="small"
            />
          ))}
        </PlayerContainer>
      </PlacingContainer>
      <PlacingContainer>
        <SubHeading style={{ fontSize: "0.8rem" }}>Most Presses</SubHeading>
        <Number>{topPressPlayers[0] && topPressPlayers[0].totalPresses}</Number>
        <PlayerContainer>
          {topPressPlayers.map((p) => (
            <PlayerAvatar
              key={p.player.id}
              playerId={p.player.id}
              size="small"
            />
          ))}
        </PlayerContainer>
      </PlacingContainer>
    </Container>
  );
}
