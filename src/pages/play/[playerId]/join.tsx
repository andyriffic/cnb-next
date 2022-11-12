import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const { groupJoin } = useSocketIo();
  const [groupId, setGroupId] = useState("");
  const playerId = router.query.playerId as string;
  const joinedId = router.query.joinedId as string;

  const joinedGroup = useMemo(() => {
    if (joinedId && joinedId === groupId) {
      return groupJoin.playerGroups.find((g) => g.id === joinedId);
    }
  }, [groupId, joinedId, groupJoin.playerGroups]);

  return (
    <PlayerPageLayout>
      {joinedGroup ? (
        <div>
          <h1>You&lsquo;ve joined!</h1>
          <p>Waiting for other players</p>
        </div>
      ) : (
        <div>
          {" "}
          <h1>Join a game</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              groupJoin.joinGroup(playerId, groupId, (groupId) =>
                router.push(`/play/${playerId}/join?joinedId=${groupId}`)
              );
            }}
          >
            <fieldset>
              <label htmlFor="group-id-input">Group Id</label>
              <input
                id="group-id-input"
                type="tel"
                maxLength={4}
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                autoComplete="off"
              ></input>
              <button type="submit">JOIN</button>
            </fieldset>
          </form>
        </div>
      )}
    </PlayerPageLayout>
  );
}

export default Page;
