import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GameTypes } from "../../../pages/join/[groupId]";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import { QueryUserQuestion } from "../../../services/query-user/types";
import { ThemedPrimaryButton } from "../../Atoms";
import { DialogModal } from "../../DialogModal";
import THEME from "../../../themes";
import { PopularGameSelector } from "./PopularGameSelector";

const SuggestedText = styled.span`
  //   color: ${THEME.tokens.colours.primaryText}};
  text-transform: uppercase;
  font-size: 0.8rem;
`;

export const GAME_QUESTION: QueryUserQuestion<GameTypes> = {
  id: "which-game-to-play",
  question: "What game should we play?",
  style: "normal",
  options: [
    { text: "Betting 🎲", value: "rps" },
    { text: "Balloon 🎈", value: "balloon" },
    { text: "Number Crunch 💯", value: "number-crunch" },
  ],
};

type Props = {
  playerIds: string[];
  onGameSelected: (gameType: GameTypes) => void;
};

export const AudienceGameSelection = ({ playerIds, onGameSelected }: Props) => {
  const { playerQuery } = useSocketIo();
  const sentSurvey = useRef(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (sentSurvey.current) return;
    if (!showModal) return;

    playerIds.forEach((playerId) => {
      playerQuery.createPlayerQuestion(playerId, GAME_QUESTION);
    });
    sentSurvey.current = true;
  }, [playerIds, playerQuery, showModal]);

  return showModal ? (
    <DialogModal show={showModal} options={[]}>
      <PopularGameSelector
        question={GAME_QUESTION}
        questionsByPlayerId={playerQuery.questionsByPlayerId}
        onGameSelected={(gameType) => {
          playerIds.forEach((playerId) => {
            playerQuery.deletePlayerQuestion(playerId);
          });
          onGameSelected(gameType);
        }}
      />
    </DialogModal>
  ) : (
    <ThemedPrimaryButton
      onClick={() => setShowModal(true)}
      disabled={playerIds.length < 3}
    >
      <>
        <SuggestedText>Wait until all players are ready 😅</SuggestedText>
        <br />
      </>
      Ask the audience 💬
    </ThemedPrimaryButton>
  );
};
