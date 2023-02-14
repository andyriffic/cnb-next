import { useMemo } from "react";
import styled from "styled-components";
import {
  RPSPlayerMove,
  RPSSpectatorRoundView,
} from "../../services/rock-paper-scissors/types";
import { Card, PrimaryButton, SubHeading } from "../Atoms";

type Props = {
  playerId: string;
  makeMove: (move: RPSPlayerMove) => void;
  currentRound: RPSSpectatorRoundView;
};

const MoveOptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-evenly;
`;

const MoveIcon = styled.span`
  font-size: 2rem;
`;

const RoundResultIcon = styled.div`
  font-size: 6rem;
`;

export const PlayerGameCurrentRound = ({
  currentRound,
  playerId,
  makeMove,
}: Props): JSX.Element | null => {
  const hasMoved = useMemo(() => {
    return currentRound.movedPlayerIds.includes(playerId);
  }, [currentRound, playerId]);

  const currentResult = useMemo(() => {
    return currentRound.result;
  }, [currentRound]);

  if (currentResult) {
    // return (
    //   <Card style={{ textAlign: "center" }}>
    //     {currentResult.draw ? (
    //       <>
    //         <SubHeading>Draw</SubHeading>
    //         <RoundResultIcon>😅</RoundResultIcon>
    //       </>
    //     ) : currentResult.winningPlayerId === playerId ? (
    //       <>
    //         <SubHeading>Won</SubHeading>
    //         <RoundResultIcon>🎉</RoundResultIcon>
    //       </>
    //     ) : (
    //       <>
    //         <SubHeading>Lost</SubHeading>
    //         <RoundResultIcon>😭</RoundResultIcon>
    //       </>
    //     )}
    //   </Card>
    // );
    return null;
  }

  return hasMoved ? (
    <Card style={{ textAlign: "center" }}>
      <SubHeading>Moved</SubHeading>
      <RoundResultIcon>🤞</RoundResultIcon>
    </Card>
  ) : (
    <Card>
      <SubHeading style={{ marginBottom: "1rem" }}>Select your move</SubHeading>

      <MoveOptionsContainer>
        <PrimaryButton onClick={() => makeMove({ playerId, moveName: "rock" })}>
          <MoveIcon>🪨</MoveIcon>
        </PrimaryButton>
        <PrimaryButton
          onClick={() => makeMove({ playerId, moveName: "paper" })}
        >
          <MoveIcon>📄</MoveIcon>
        </PrimaryButton>
        <PrimaryButton
          onClick={() => makeMove({ playerId, moveName: "scissors" })}
        >
          <MoveIcon>✂️</MoveIcon>
        </PrimaryButton>
      </MoveOptionsContainer>
    </Card>
  );
};
