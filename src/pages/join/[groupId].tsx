import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { useSocketIo } from "../../providers/SocketIoProvider";

function Page() {
  const router = useRouter();
  const { groupJoin } = useSocketIo();
  const groupId = router.query.groupId as string;

  const group = useMemo(() => {
    return groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [groupJoin.playerGroups, groupId]);

  return (
    <SpectatorPageLayout>
      <label>Join Code:</label>
      <h1>{groupId}</h1>
      {group ? "Valid Group 😄" : "Invalid group 😭"}
    </SpectatorPageLayout>
  );
}

export default Page;
