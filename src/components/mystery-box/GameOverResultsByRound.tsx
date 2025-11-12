import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { COLORS, FONT_FAMILY } from "../../colors";
import { MysteryBoxGameView } from "../../services/mystery-box/types";
import THEME from "../../themes";
import { FeatureHeading, SmallHeading } from "../Atoms";
import { PlayerAvatar } from "../PlayerAvatar";
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";

const Container = styled.div`
  width: 80vw;
  margin: 3rem auto;
  display: flex;
  flex-direction: column-reverse;
  border: 2px solid black;
  border-radius: 1rem;
  overflow: hidden;
`;

const RoundRow = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  align-items: center;
`;
const RoundTitle = styled(SmallHeading)`
  margin-right: 2rem;
  min-width: 10vw;
`;

const RoundPlayers = styled.div`
  display: flex;
`;

const RoundPlayer = styled.div`
  position: relative;
`;

const Points = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2vw;
  height: 2vw;
  background: darkblue;
  color: ${THEME.tokens.colours.primaryText};
  border-radius: 50%;
  border: 0.2rem solid ${COLORS.borderPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-family: ${FONT_FAMILY.numeric};
  font-weight: bold;
`;

function getBackgroundColourForRoundIndex(
  index: number,
  totalRounds: number,
  hasWinner: boolean
) {
  if (hasWinner && index === totalRounds - 1) {
    return "goldenrod";
  }

  return index % 2 === 0
    ? THEME.tokens.colours.secondaryBackground
    : THEME.tokens.colours.primaryBackground;
}

type Props = {
  game: MysteryBoxGameView;
};

export const GameOverResultsByRound = ({ game }: Props) => {
  const { play } = useSound();
  const [displayIndex, setDisplayIndex] = useState(0);
  const roundsWithPlayersEliminated = useMemo(() => {
    return game.previousRounds.filter((r) =>
      r.boxes.some(
        (box) => box.contents.type === "bomb" && box.playerIds.length > 0
      )
    );
  }, [game.previousRounds]);

  useEffect(() => {
    if (displayIndex === roundsWithPlayersEliminated.length - 1) {
      if (game.gameOverSummary?.outrightWinnerPlayerId) {
        play("number-crunch-final-show-winner");
      } else {
        play("number-crunch-player-guessed-close");
      }
      return;
    }
    play("number-crunch-reveal-guess");
    const interval = setInterval(() => {
      setDisplayIndex(displayIndex + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [
    displayIndex,
    game.gameOverSummary?.outrightWinnerPlayerId,
    play,
    roundsWithPlayersEliminated.length,
  ]);

  return (
    <>
      <FeatureHeading
        style={{ fontSize: "6rem", textAlign: "center", marginTop: "2rem" }}
      >
        Final results
      </FeatureHeading>
      <Container>
        {roundsWithPlayersEliminated
          .filter((_, i) => i <= displayIndex)
          .map((round, i) => (
            <Appear
              key={round.id}
              // delayMilliseconds={i * 2000}
              animation="text-focus-in"
            >
              <RoundRow
                key={round.id}
                style={{
                  backgroundColor: getBackgroundColourForRoundIndex(
                    i,
                    roundsWithPlayersEliminated.length,
                    !!game.gameOverSummary?.outrightWinnerPlayerId
                  ),
                }}
              >
                <RoundTitle>Round {round.id}</RoundTitle>
                <RoundPlayers>
                  {round.boxes
                    .filter((box) => box.contents.type === "bomb")
                    .flatMap((box) => box.playerIds)
                    .map((playerId) =>
                      game.players.find((p) => p.id === playerId)
                    )
                    .filter((p) => p !== undefined)
                    .map((player) => (
                      <RoundPlayer key={player.id}>
                        <PlayerAvatar playerId={player.id} size="tiny" />
                        <Points>{player.lootTotals.points?.total}</Points>
                      </RoundPlayer>
                    ))}
                </RoundPlayers>
              </RoundRow>
            </Appear>
          ))}
      </Container>
    </>
  );
};
