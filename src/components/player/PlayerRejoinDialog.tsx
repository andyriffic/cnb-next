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
  const [showModal, setShowModal] = useState(false);
  const { getName } = usePlayerNames();
  const router = useRouter();

  const playerId = getPlayerLocalStorageSettings()?.playerId;

  const playerConfirmed = () => {
    if (!playerId) {
      return;
    }
    router.push(getPlayerHomeUrl(playerId, autoJoinGroupId));
  };

  const playerNotConfirmed = () => {
    clearAllPlayerSettings();
    setShowModal(false);
  };

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
      <strong style={{ fontWeight: "bold" }}>{getName(playerId || "")}</strong>?
    </DialogModal>
  );
};
