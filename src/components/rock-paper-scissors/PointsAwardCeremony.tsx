import { useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, FONT_FAMILY } from "../../colors";
import {
  RockPaperScissorsPoints,
  toGameMoves,
} from "../../services/rock-paper-scissors/points";
import { savePlayerGameMovesFetch } from "../../utils/api";
import { Appear } from "../animations/Appear";
import { Heading, SubHeading } from "../Atoms";
import { FeatureValue } from "../FeatureValue";
import { useDoOnce } from "../hooks/useDoOnce";
import { useSound } from "../hooks/useSound";
import { CenterSpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";

enum STORYBOARD {
  SHOW_WINNER = 0,
  SHOW_MIDDLE = 1,
  SHOW_LOSER = 2,
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
`;
const Points = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2vw;
  height: 2vw;
  background-color: white;
  border-radius: 50%;
  border: 0.2rem solid ${COLORS.borderPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-family: ${FONT_FAMILY.numeric};
  font-weight: bold;
`;

type Props = {
  gameId: string;
  gamePoints: RockPaperScissorsPoints;
};

export const PointsAwardCeremony = ({
  gameId,
  gamePoints,
}: Props): JSX.Element => {
  const currentStoryboard = useStoryBoardTiming({
    losers: gamePoints.zeroPointLosers.length > 0,
  });

  useDoOnce(() => {
    const gameMoves = toGameMoves(gamePoints);
    savePlayerGameMovesFetch(gameId, gameMoves)
      .then(() => console.log("Updated games moves"))
      .catch((err) => console.error(err));
  });

  return (
    <Container>
      {currentStoryboard >= STORYBOARD.SHOW_WINNER && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "3vh" }}>
            <Heading>Winner 优胜者</Heading>
            {gamePoints.outrightWinner ? (
              <PlayerContainer>
                <PlayerAvatar
                  playerId={gamePoints.outrightWinner.playerId}
                  size="small"
                />
                <Points>{gamePoints.outrightWinner.points}</Points>
              </PlayerContainer>
            ) : (
              <SubHeading style={{ fontSize: "4rem", lineHeight: "8rem" }}>
                孤独 😩
              </SubHeading>
            )}
          </CenterSpaced>
        </Appear>
      )}
      {currentStoryboard >= STORYBOARD.SHOW_MIDDLE && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "4vh" }}>
            <SubHeading>Others 其他的</SubHeading>
            <PlayerList>
              {gamePoints.middleOfThePack.map((playerPoints) => (
                <PlayerContainer key={playerPoints.playerId}>
                  <PlayerAvatar
                    playerId={playerPoints.playerId}
                    size="thumbnail"
                  />
                  <Points>{playerPoints.points}</Points>
                </PlayerContainer>
              ))}
            </PlayerList>
          </CenterSpaced>
        </Appear>
      )}
      {currentStoryboard >= STORYBOARD.SHOW_LOSER && (
        <Appear animation="flip-in">
          <CenterSpaced stacked={true} style={{ marginTop: "4vh" }}>
            <SubHeading>Biggest losers 大输家</SubHeading>
            <PlayerList>
              {gamePoints.zeroPointLosers.map((playerPoints) => (
                <PlayerContainer key={playerPoints.playerId}>
                  <PlayerAvatar
                    playerId={playerPoints.playerId}
                    size="thumbnail"
                  />
                  <Points>{playerPoints.points}</Points>
                </PlayerContainer>
              ))}
            </PlayerList>
          </CenterSpaced>
        </Appear>
      )}
    </Container>
  );
};

function useStoryBoardTiming({ losers }: { losers: boolean }): STORYBOARD {
  const { play } = useSound();
  const [currentStoryboard, setCurrentStoryboard] = useState<STORYBOARD>(
    STORYBOARD.SHOW_WINNER
  );

  useEffect(() => {
    play("rps-award-winner");
  }, [play]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentStoryboard(STORYBOARD.SHOW_MIDDLE);
      play("rps-award-middle");
    }, 2000);
  }, [play]);

  useEffect(() => {
    if (!losers) {
      return;
    }
    setTimeout(() => {
      setCurrentStoryboard(STORYBOARD.SHOW_LOSER);
      play("rps-award-loser");
    }, 5000);
  }, [play, losers]);

  return currentStoryboard;
}