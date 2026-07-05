import { useMemo } from "react";
import { usePlayerNames } from "../providers/PlayerNamesProvider";
import { useSocketIo } from "../providers/SocketIoProvider";
import { PlayerGroup } from "../services/player-join/types";
import { CaptionText, Pill, SmallPill } from "./Atoms";

type Props = {
  group: PlayerGroup;
  setForceShowAllGameSelection: (show: boolean) => void;
  team?: string;
};

export const DebugPlayerJoin = ({
  group,
  setForceShowAllGameSelection,
  team,
}: Props) => {
  const { names } = usePlayerNames();
  const { groupJoin } = useSocketIo();

  const playersNotJoined = useMemo(() => {
    const allPlayerIds = Object.keys(names).sort();

    return allPlayerIds.filter((pid) => !group.playerIds.includes(pid));
  }, [group, names]);

  return (
    <div>
      {team && <SmallPill>{team}</SmallPill>}
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
