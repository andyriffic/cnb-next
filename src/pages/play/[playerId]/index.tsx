import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
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
import { getPlayerJoinUrl } from "../../../utils/url";
import { PlayerColourSelector } from "../../../components/player/PlayerColourSelector";
import { PlayerAutoJoinDialog } from "../../../components/player/PlayerAutoJoinGameDialog";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  player: Player;
};

function Page({ player }: Props) {
  const { query } = useRouter();
  return (
    <PlayerPageLayout headerContent={<>{player.name}</>} playerId={player.id}>
      <Card>
        <SubHeading>What to do</SubHeading>
        <Link
          href={getPlayerJoinUrl(player.id, query.autoJoinId as string)}
          passHref={true}
          legacyBehavior
        >
          <PrimaryLinkButton>Join a game</PrimaryLinkButton>
        </Link>
      </Card>
      <PlayerGamesList playerId={player.id} />
      <PlayerColourSelector player={player} />
      <PlayerAutoJoinDialog
        playerId={player.id}
        groupId={query.autoJoinId as string}
      />
    </PlayerPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const player = await getPlayer(params!.playerId! as string);
  return {
    props: { player },
  };
};

export default Page;
