import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";
import { numberCrunchGameToPoints } from "../../services/number-crunch/points";
import {
  NumberCrunchFinalResultsView,
  NumberCrunchGameView,
} from "../../services/number-crunch/types";
import THEME from "../../themes/types";
import { savePlayerGameMovesFetch } from "../../utils/api";
import { FeatureHeading, SmallHeading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { LinkToMiniGame } from "../LinkToMiniGame";
import { PlayerAvatar } from "../PlayerAvatar";
import { Positioned } from "../Positioned";
import { Appear } from "../animations/Appear";
import { useDoOnce } from "../hooks/useDoOnce";
import { useSound } from "../hooks/useSound";

const FinalGuessLine = styled.div`
  width: 100%;
  height: 1vh;
  background-color: ${THEME.colours.textAccent};
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const FinalGuessDotsContainer = styled.div`
  width: calc(100% - 1vh);
  position: relative;
  height: 20rem;
`;

const DotPlayerNameContainer = styled.div`
  /* margin-top: 3rem; */
  transform: translateX(-50%);
  padding: 0.3rem;
  border: 1px solid white;
  border-radius: 0.5rem;
  background-color: ${THEME.colours.secondaryBackground};
`;

const GuessContainer = styled.div`
  position: absolute;
  cursor: default;
  transform: translateY(-0.5rem);
  &:hover {
    z-index: 1;

    ${DotPlayerNameContainer} {
      background-color: ${THEME.colours.textAccent};
    }
  }
`;

const GuessDotNameConnectorGuide = styled.div`
  width: 2px;
  background-color: white;
`;

const PlayerName = styled.div`
  color: black;
  font-size: 0.8rem;
`;

const GuessDot = styled.div`
  width: 2vh;
  height: 2vh;
  border-radius: 50%;
  background: white;
  transform: translateX(-50%);
  color: black;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
`;

const TargetDot = styled(GuessDot)`
  background: darkred;
`;

type Props = {
  gameView: NumberCrunchGameView;
  finalResults: NumberCrunchFinalResultsView;
};

enum RevealState {
  SHOW_TARGET = 0,
  SHOW_WINNERS = 1,
  SHOW_REST = 2,
  SHOW_POINTS_LEGEND = 3,
}

export const FinalResults = ({ gameView, finalResults }: Props) => {
  const [revealState, setRevealState] = useState(RevealState.SHOW_TARGET);
  useRevealTiming(revealState, setRevealState);
  const [revealBucketIndex, setRevealBucketIndex] = useState(0);
  const { getName } = usePlayerNames();

  useEffect(() => {
    if (revealState >= RevealState.SHOW_REST) {
      const interval = setInterval(() => {
        setRevealBucketIndex((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [revealState]);

  useDoOnce(() => {
    const gameMoves = numberCrunchGameToPoints(gameView);
    savePlayerGameMovesFetch(gameView.id, gameMoves);
    console.log("saving game moves", gameMoves);
  }, revealState === RevealState.SHOW_POINTS_LEGEND);

  return (
    <CenterSpaced stacked={true}>
      {revealState >= RevealState.SHOW_TARGET && (
        <Appear>
          <SmallHeading centered={true}>Target</SmallHeading>
          <FeatureHeading>{finalResults.target}</FeatureHeading>
        </Appear>
      )}
      {revealState >= RevealState.SHOW_WINNERS && (
        <Appear>
          <SmallHeading centered={true}>
            Winner{finalResults.winningPlayerIds.length > 1 ? "s" : ""}
          </SmallHeading>
          <CenterSpaced>
            {finalResults.winningPlayerIds.map((playerId) => (
              <PlayerAvatar key={playerId} playerId={playerId} size="small" />
            ))}
          </CenterSpaced>
        </Appear>
      )}
      {revealState >= RevealState.SHOW_REST && (
        <Appear animation="text-focus-in">
          <div style={{ width: "90vw" }}>
            <SmallHeading centered={true}>Final Guesses</SmallHeading>
            <FinalGuessLine>
              {/* <TargetDot style={{ left: `${finalResults.target}%` }} /> */}
              <FinalGuessDotsContainer>
                {finalResults.finalRoundSummary.map((roundView, i) => {
                  const namesOffset = roundView.guess % 5;
                  if (roundView.bucketRangeIndex > revealBucketIndex) {
                    return;
                  }
                  return (
                    <GuessContainer
                      key={i}
                      style={{
                        left: `${roundView.guess}%`,
                      }}
                    >
                      <GuessDot
                        style={{
                          backgroundColor:
                            NUMBER_CRUNCH_BUCKET_RANGES[
                              roundView.bucketRangeIndex
                            ]!.color,
                        }}
                      >
                        {roundView.guess}
                      </GuessDot>
                      <GuessDotNameConnectorGuide
                        style={{ height: `${namesOffset * 2 + 1}rem` }}
                      />
                      <DotPlayerNameContainer
                        style={{
                          backgroundColor:
                            NUMBER_CRUNCH_BUCKET_RANGES[
                              roundView.bucketRangeIndex
                            ]!.color,
                        }}
                      >
                        {roundView.playerIds.map((playerId) => (
                          <PlayerName key={playerId}>
                            {getName(playerId)}
                            {roundView.bucketRangeIndex === 0 && "🎉"}
                          </PlayerName>
                        ))}
                      </DotPlayerNameContainer>
                    </GuessContainer>
                  );
                })}
              </FinalGuessDotsContainer>
            </FinalGuessLine>
          </div>
        </Appear>
      )}
      {revealState >= RevealState.SHOW_POINTS_LEGEND && (
        <Positioned horizontalAlign={{ align: "center", bottomPercent: 20 }}>
          <LinkToMiniGame />
        </Positioned>
      )}
    </CenterSpaced>
  );
};

function useRevealTiming(
  revealState: RevealState,
  setRevealState: (revealState: RevealState) => void
) {
  const { play } = useSound();

  useEffect(() => {
    if (revealState === RevealState.SHOW_TARGET) {
      play("number-crunch-final-show-winner");
      setTimeout(() => setRevealState(RevealState.SHOW_WINNERS), 1300);
    }
  }, [play, revealState, setRevealState]);

  useEffect(() => {
    if (revealState === RevealState.SHOW_WINNERS) {
      setTimeout(() => setRevealState(RevealState.SHOW_REST), 2000);
    }
  }, [revealState, setRevealState]);

  useEffect(() => {
    if (revealState === RevealState.SHOW_REST) {
      play("number-crunch-final-show-rest");
      setTimeout(() => setRevealState(RevealState.SHOW_POINTS_LEGEND), 2000);
    }
  }, [play, revealState, setRevealState]);
}
