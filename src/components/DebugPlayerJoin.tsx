import { useMemo } from "react";
import { usePlayerNames } from "../providers/PlayerNamesProvider";
import { useSocketIo } from "../providers/SocketIoProvider";
import { PlayerGroup } from "../services/player-join/types";
import { CaptionText } from "./Atoms";

type Props = {
  group: PlayerGroup;
  setForceShowAllGameSelection: (show: boolean) => void;
};

export const DebugPlayerJoin = ({
  group,
  setForceShowAllGameSelection,
}: Props) => {
  const { names } = usePlayerNames();
  const { groupJoin } = useSocketIo();

  const playersNotJoined = useMemo(() => {
    const allPlayerIds = Object.keys(names).sort();

    return allPlayerIds.filter((pid) => !group.playerIds.includes(pid));
  }, [group, names]);

  return (
    <div>
      <CaptionText>Join Group</CaptionText>
      <div>
        {playersNotJoined.map((pid) => (
          <button key={pid} onClick={() => groupJoin.joinGroup(pid, group.id)}>
            {pid}
          </button>
        ))}
      </div>
      <hr />
      <button type="button" onClick={() => setForceShowAllGameSelection(true)}>
        Force Show All Game Selection
      </button>
    </div>
  );
};
