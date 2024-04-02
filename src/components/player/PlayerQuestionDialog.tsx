import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import {
  clearAllPlayerSettings,
  getPlayerLocalStorageSettings,
} from "../../utils/client-only/localStorage";
import { getPlayerHomeUrl } from "../../utils/url";
import { DialogModal } from "../DialogModal";
import { useSocketIo } from "../../providers/SocketIoProvider";

type Props = {
  playerId: string;
};

export const PlayerQuestionDialog = ({ playerId }: Props) => {
  const { playerQuery } = useSocketIo();

  // const [showModal, setShowModal] = useState(false);

  const activePlayerQuestion = useMemo(() => {
    return playerQuery.questionsByPlayerId[playerId];
  }, [playerId, playerQuery.questionsByPlayerId]);

  // useEffect(() => {
  //   const localPlayerSettings = getPlayerLocalStorageSettings();
  //   if (localPlayerSettings?.playerId) {
  //     setShowModal(true);
  //   }
  // }, [showModal]);

  if (!activePlayerQuestion) {
    return null;
  }

  return (
    <DialogModal show={!activePlayerQuestion.selectedOptionId}>
      {activePlayerQuestion.question}
    </DialogModal>
  );
};
