import { useState } from "react";
import styled from "styled-components";
import {
  NumberCrunchFinalResultsRoundPlayerGuessView,
  NumberCrunchFinalResultsView,
  NumberCrunchGameView,
} from "../../services/number-crunch/types";
import THEME from "../../themes/types";
import { FeatureHeading, Pill, SmallHeading } from "../Atoms";
import { CenterSpaced } from "../Layouts";
import { PlayerAvatar } from "../PlayerAvatar";
import { NUMBER_CRUNCH_BUCKET_RANGES } from "../../services/number-crunch";

const FinalGuessLine = styled.div`
  width: 100%;
  height: 2vh;
  background-color: ${THEME.colours.textAccent};
  border-radius: 1rem;
  display: flex;
  justify-content: center;
`;

const FinalGuessDotsContainer = styled.div`
  width: calc(100% - 1vh);
  position: relative;
`;

const GuessContainer = styled.div`
  position: absolute;
`;

const DotPlayerNameContainer = styled.div`
  margin-top: 3rem;
  transform: translateX(-50%);
`;

const PlayerName = styled.div``;

const GuessDot = styled.div`
  width: 2vh;
  height: 2vh;
  border-radius: 50%;
  background: white;
  transform: translateX(-50%);
  color: white;
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

const sortGuessesFurthestFirst = (
  a: NumberCrunchFinalResultsRoundPlayerGuessView,
  b: NumberCrunchFinalResultsRoundPlayerGuessView
) => b.guess - a.guess;

export const FinalResults = ({ gameView, finalResults }: Props) => {
  const [playerRevealOrder] = useState(
    finalResults.allRounds[
      finalResults.allRounds.length - 1
    ]!.playerGuesses.sort(sortGuessesFurthestFirst)
  );

  return (
    <CenterSpaced stacked={true}>
      <div>
        <SmallHeading centered={true}>Target</SmallHeading>
        <FeatureHeading>{finalResults.target}</FeatureHeading>
      </div>
      <div>
        <SmallHeading centered={true}>
          Winner{finalResults.winningPlayerIds.length > 1 ? "s" : ""}
        </SmallHeading>
        <CenterSpaced>
          {finalResults.winningPlayerIds.map((playerId) => (
            <PlayerAvatar key={playerId} playerId={playerId} size="small" />
          ))}
        </CenterSpaced>
      </div>
      <div style={{ width: "90vw" }}>
        <SmallHeading centered={true}>Final Guesses</SmallHeading>
        <FinalGuessLine>
          {/* <TargetDot style={{ left: `${finalResults.target}%` }} /> */}
          <FinalGuessDotsContainer>
            {finalResults.finalRoundSummary.map((roundView, i) => (
              <GuessContainer
                key={i}
                style={{
                  left: `${roundView.guess}%`,
                }}
              >
                <GuessDot
                  style={{
                    backgroundColor:
                      NUMBER_CRUNCH_BUCKET_RANGES[roundView.bucketRangeIndex]!
                        .color,
                  }}
                >
                  {roundView.guess}
                </GuessDot>
                <DotPlayerNameContainer>
                  {roundView.playerIds.map((playerId) => (
                    <PlayerName key={playerId}>{playerId}</PlayerName>
                  ))}
                </DotPlayerNameContainer>
              </GuessContainer>
            ))}
          </FinalGuessDotsContainer>
        </FinalGuessLine>
      </div>
    </CenterSpaced>
  );
};
