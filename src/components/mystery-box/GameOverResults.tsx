import { useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, FONT_FAMILY } from "../../colors";
import {
  RockPaperScissorsPoints,
  toGameMoves,
} from "../../services/rock-paper-scissors/points";
import THEME from "../../themes";
import { savePlayerGameMovesFetch } from "../../utils/api";
import { Heading, SubHeading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { LinkToMiniGame } from "../LinkToMiniGame";
import { PlayerAvatar } from "../PlayerAvatar";
import { Appear } from "../animations/Appear";
import { useDoOnce } from "../hooks/useDoOnce";
import { useSound } from "../hooks/useSound";
import {
  MysteryBox,
  MysteryBoxGameView,
} from "../../services/mystery-box/types";

enum STORYBOARD {
  SHOW_WINNER = 0,
  SHOW_EVERYONE_ELSE = 1,
  SHOW_LOSERS = 2,
  SHOW_MINIGAME_CTA = 3,
}

const Container = styled.div``;

const PlayerList = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90vw;
  flex-wrap: wrap;
`;

const PlayerContainer = styled.div`
  position: relative;
  text-align: center;
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

const Round = styled.span`
  display: inline-block;
  background: darkorange;
  padding: 0.3rem 0.5rem;
  color: ${THEME.tokens.colours.primaryText};
  border-radius: 1rem;
  border: 0.1rem solid white;
  font-family: ${THEME.tokens.fonts.body};
`;

type Props = {
  game: MysteryBoxGameView;
};

export const GameOverResults = ({ game }: Props) => {
  const hasWinner = !!game.gameOverSummary?.outrightWinnerPlayerId;
  const currentStoryboard = useStoryBoardTiming({
    hasWinner,
  });

  const orderedPlayersByPoints = game.players
    .filter(
      (player) => player.id !== game.gameOverSummary?.outrightWinnerPlayerId
    )
    .map((player) => ({
      player: player,
      points: player.lootTotals.points?.total || 0,
    }))

    .sort((a, b) => b.points - a.points);

  // useDoOnce(() => {
  //   const gameMoves = toGameMoves(gamePoints);
  //   savePlayerGameMovesFetch(gameId, gameMoves, team)
  //     .then(() => console.log("Updated games moves"))
  //     .catch((err) => console.error(err));
  // });

  return (
    <Container>
      {currentStoryboard >= STORYBOARD.SHOW_WINNER && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "3vh" }}>
            <Heading>Winner 优胜者</Heading>
            {game.gameOverSummary?.outrightWinnerPlayerId ? (
              <PlayerContainer>
                <PlayerAvatar
                  playerId={game.gameOverSummary?.outrightWinnerPlayerId}
                  size="small"
                />
                {/* <Points>{game}</Points> */}
                <Round>Round {game.gameOverSummary?.maxRoundId}</Round>
              </PlayerContainer>
            ) : (
              <SubHeading style={{ fontSize: "4rem", lineHeight: "8rem" }}>
                孤独 😩
              </SubHeading>
            )}
          </CenterSpaced>
        </Appear>
      )}
      {currentStoryboard >= STORYBOARD.SHOW_EVERYONE_ELSE && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "4vh" }}>
            <SubHeading>Others 其他的</SubHeading>
            <PlayerList>
              {orderedPlayersByPoints
                .filter((p) => p.points > 0)
                .map((player) => (
                  <PlayerContainer key={player.player.id}>
                    <PlayerAvatar
                      playerId={player.player.id}
                      size="thumbnail"
                    />
                    <Points>{player.points}</Points>
                  </PlayerContainer>
                ))}
            </PlayerList>
          </CenterSpaced>
        </Appear>
      )}
      {currentStoryboard >= STORYBOARD.SHOW_LOSERS && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "4vh" }}>
            <SubHeading>Biggest losers 大输家</SubHeading>
            <PlayerList>
              {orderedPlayersByPoints
                .filter((p) => p.points === 0)
                .map((player) => (
                  <PlayerContainer key={player.player.id}>
                    <PlayerAvatar
                      playerId={player.player.id}
                      size="thumbnail"
                    />
                    <Points>{player.points}</Points>
                  </PlayerContainer>
                ))}
            </PlayerList>
          </CenterSpaced>
        </Appear>
      )}
      {currentStoryboard >= STORYBOARD.SHOW_MINIGAME_CTA && (
        <Appear animation="flip-in">
          {" "}
          <CenterSpaced stacked={true} style={{ marginTop: "4vh" }}>
            <LinkToMiniGame />
          </CenterSpaced>
        </Appear>
      )}
    </Container>
  );
};

function useStoryBoardTiming({
  hasWinner,
}: {
  hasWinner: boolean;
}): STORYBOARD {
  const { play } = useSound();
  const [currentStoryboard, setCurrentStoryboard] = useState<STORYBOARD>(
    STORYBOARD.SHOW_WINNER
  );

  useEffect(() => {
    play("rps-award-winner");
  }, [play]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentStoryboard(STORYBOARD.SHOW_EVERYONE_ELSE);
    }, 3000);
  }, [play]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentStoryboard(STORYBOARD.SHOW_LOSERS);
    }, 8000);
  }, [play]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentStoryboard(STORYBOARD.SHOW_MINIGAME_CTA);
    }, 8000);
  }, []);

  return currentStoryboard;
}
