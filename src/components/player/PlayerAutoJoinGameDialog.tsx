import { useState } from "react";
import { useRouter } from "next/router";
import { DialogModal } from "../DialogModal";
import { useSocketIo } from "../../providers/SocketIoProvider";

type Props = {
  playerId: string;
  groupId: string;
};

export const PlayerAutoJoinDialog = ({ playerId, groupId }: Props) => {
  const [showModal, setShowModal] = useState(!!groupId);
  const { groupJoin } = useSocketIo();
  const router = useRouter();

  const joinGame = () => {
    groupJoin.joinGroup(playerId, groupId, (groupId) =>
      router.push(`/play/${playerId}/join?joinedId=${groupId}`)
    );
  };

  return (
    <DialogModal
      show={showModal}
      options={[
        { text: "Yes", onSelected: joinGame },
        {
          text: "No",
          onSelected: () => {
            setShowModal(false);
          },
        },
      ]}
    >
      Join game <strong style={{ fontWeight: "bold" }}>{groupId}</strong>?
    </DialogModal>
  );
};
