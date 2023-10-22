import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import {
  clearAllPlayerSettings,
  getPlayerLocalStorageSettings,
} from "../../utils/client-only/localStorage";
import { getPlayerHomeUrl } from "../../utils/url";
import { DialogModal } from "../DialogModal";

type Props = {
  autoJoinGroupId: string;
};

export const PlayerRejoinDialog = ({ autoJoinGroupId }: Props) => {
  const [playerIdFromLocalStorage, setPlayerIdFromLocalStorage] =
    useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const { getName } = usePlayerNames();
  const router = useRouter();

  const playerConfirmed = () => {
    router.push(getPlayerHomeUrl(playerIdFromLocalStorage, autoJoinGroupId));
  };

  const playerNotConfirmed = () => {
    clearAllPlayerSettings();
    setShowModal(false);
  };

  useEffect(() => {
    const localPlayerSettings = getPlayerLocalStorageSettings();
    localPlayerSettings &&
      setPlayerIdFromLocalStorage(localPlayerSettings.playerId);
  }, []);

  useEffect(() => {
    const localPlayerSettings = getPlayerLocalStorageSettings();
    if (localPlayerSettings?.playerId) {
      setShowModal(true);
    }
  }, [showModal]);

  return (
    <DialogModal
      show={showModal}
      options={[
        { text: "Yes", onSelected: playerConfirmed },
        {
          text: "No",
          onSelected: playerNotConfirmed,
        },
      ]}
    >
      Are you{" "}
      <strong style={{ fontWeight: "bold" }}>
        {getName(playerIdFromLocalStorage || "")}
      </strong>
      ?
    </DialogModal>
  );
};
