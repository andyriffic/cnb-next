import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";
import { AnimateFadeInLeft } from "../../../components/animations/FadeInLeft";
import { AnimateFadeInRight } from "../../../components/animations/FadeInRight";
import { PlayerAvatar } from "../../../components/PlayerAvatar";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { useFetchPlayerQuery } from "../../../providers/GraphqlProvider";
import { Player } from "../../../types/Player";
import { getCnbPlayer, getCnbPlayers } from "../../../utils/data/graphql";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const PlayerName = styled.div`
  background-color: #2f70af;
  padding: 1rem;
  color: #f5f5f5;
  /* border: 0.5rem solid #b9848c; */
  border-radius: 1rem;
  font-size: 3rem;
  width: auto;
  display: inline-block;
  text-transform: uppercase;
`;

type Props = {
  player: Player;
};

function Page({ player }: Props) {
  // const router = useRouter();
  // const { playerId } = router.query;
  // const { data, fetching, error } = useFetchPlayerQuery(playerId as string);

  // if (fetching) {
  //   return <h3>Finding player...</h3>;
  // }

  // if (!(data && data.player)) {
  //   return <h3>Player not found :(</h3>;
  // }

  return (
    <SpectatorPageLayout>
      {/* {error && <p>Error: {JSON.stringify(error)}</p>} */}
      <CenterAlignContainer>
        <div>
          <AnimateFadeInLeft>
            <PlayerAvatar player={player} />
          </AnimateFadeInLeft>
          <AnimateFadeInRight delayMilliseconds={500}>
            <PlayerName>{player.name}</PlayerName>
          </AnimateFadeInRight>
        </div>
      </CenterAlignContainer>
    </SpectatorPageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getCnbPlayers();
  //Something

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
