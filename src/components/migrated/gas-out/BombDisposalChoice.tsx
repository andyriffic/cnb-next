import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { SmallHeading } from "../../Atoms";
import { DialogModal } from "../../DialogModal";
import { slideInUpAnimation } from "../../animations/keyframes/slideInBlurredTop";
import { QueryUserQuestion } from "../../../services/query-user/types";
import { shuffleArray } from "../../../utils/random";
import THEME from "../../../themes/types";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import { useDoOnce } from "../../hooks/useDoOnce";
import { PlayerAvatar } from "../../PlayerAvatar";

const VictimList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem;
  justify-content: center;
`;

const VictimItem = styled.div`
  width: 45%;
  // border: 1px solid red;
  text-align: center;
  position: relative;
  font-size: 3rem;
`;

const VictimItemText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: ${THEME.fonts.numbers};
  font-size: 2rem;
`;

const GraveyardPlayerItem = styled.div`
  animation: ${slideInUpAnimation} 600ms linear 1000ms both;
`;

type Props = {
  game: GasGame;
  onPlayerSelected: (playerId: string) => void;
};

const VICTIM_QUESTION_ID = "bomb-disposal-choice";
export function BombDisposalChoice({
  game,
  onPlayerSelected,
}: Props): JSX.Element | null {
  const { playerQuery } = useSocketIo();
  const [revealVictims, setRevealVictims] = useState(false);
  const [victimIds] = useState(
    shuffleArray(
      game.alivePlayersIds.filter(
        (playerId) => playerId !== game.currentPlayer.id
      )
    )
  );

  const [question] = useState<QueryUserQuestion>({
    id: VICTIM_QUESTION_ID,
    question: "Choose your victim",
    style: "emoji",
    options: victimIds.map((playerId, i) => ({
      text: `${i + 1} 💣`,
      value: playerId,
    })),
  });

  useDoOnce(() => {
    playerQuery.createPlayerQuestion(game.currentPlayer.id, question);
  });

  const chosenVictim = useMemo(() => {
    const playersCurrentQuestion =
      playerQuery.questionsByPlayerId[game.currentPlayer.id];

    if (
      !playersCurrentQuestion ||
      playersCurrentQuestion.id !== VICTIM_QUESTION_ID
    ) {
      return;
    }

    const selectedAnswerIndex = playersCurrentQuestion.selectedOptionIndex;

    if (!selectedAnswerIndex) {
      return;
    }

    return question.options[selectedAnswerIndex]?.value;
  }, [
    game.currentPlayer.id,
    playerQuery.questionsByPlayerId,
    question.options,
  ]);

  useEffect(() => {
    if (chosenVictim) {
      // onPlayerSelected(chosenVictim);
    }
  }, [chosenVictim, onPlayerSelected]);

  if (game.globalEffect?.type !== "random-explode") {
    return null;
  }

  return (
    <DialogModal show={true} options={[]}>
      <SmallHeading style={{ textAlign: "center" }}>
        Choose your victim
      </SmallHeading>
      <VictimList>
        {victimIds.map((playerId, i) => (
          <VictimItem key={playerId} title={playerId}>
            {playerId === chosenVictim ? (
              <PlayerAvatar playerId={playerId} size="thumbnail" />
            ) : (
              <>
                {" "}
                💣
                <VictimItemText>{i + 1}</VictimItemText>
              </>
            )}
          </VictimItem>
        ))}
      </VictimList>
    </DialogModal>
  );
}
