import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import styled from "styled-components";
import {
  Card,
  Heading,
  PrimaryLinkButton,
  SubHeading,
} from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { PlayerGamesList } from "../../../components/rock-paper-scissors/PlayerGamesList";
import { Player } from "../../../types/Player";
import { getAllPlayers, getPlayer } from "../../../utils/data/aws-dynamodb";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  player: Player;
};

function Page({ player }: Props) {
  return (
    <PlayerPageLayout headerContent={<>{player.name}</>}>
      <Card>
        <SubHeading>What to do</SubHeading>
        <Link href={`/play/${player.id}/join`} passHref={true}>
          <PrimaryLinkButton>Join a game</PrimaryLinkButton>
        </Link>
      </Card>
      <PlayerGamesList playerId={player.id} />
    </PlayerPageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getAllPlayers();

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
  const player = await getPlayer(params!.playerId! as string);
  return {
    props: { player },
  };
};

export default Page;
