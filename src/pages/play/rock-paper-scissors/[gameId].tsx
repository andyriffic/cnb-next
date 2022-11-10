import { useRouter } from "next/router";
import styled from "styled-components";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";

function Page() {
  const { playerId, gameId } = useRouter().query;

  console.log("Query", playerId, gameId);

  return (
    <PlayerPageLayout>
      <h1>{playerId}</h1>
      <p>{gameId}</p>
    </PlayerPageLayout>
  );
}

export default Page;
