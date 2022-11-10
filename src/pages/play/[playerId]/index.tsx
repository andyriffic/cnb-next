import { GetStaticPaths, GetStaticProps } from "next";
import styled from "styled-components";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { PlayerGamesList } from "../../../components/rock-paper-scissors/PlayerGamesList";
import { Player } from "../../../types/Player";
import { getCnbPlayer, getCnbPlayers } from "../../../utils/data/graphql";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  player: Player;
};

function Page({ player }: Props) {
  return (
    <PlayerPageLayout>
      <h1>{player.name}</h1>
      <PlayerGamesList playerId={player.id} />
    </PlayerPageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getCnbPlayers();

  if (!players) {
    return { paths: [], fallback: false };
  }

  return {
    paths: players.map((player) => ({
      params: {
        playerId: player.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const player = await getCnbPlayer(params!.playerId! as string);
  return {
    props: { player },
  };
};

export default Page;
