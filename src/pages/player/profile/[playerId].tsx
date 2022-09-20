import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { AnimateFadeIn } from "../../../components/animations/FadeIn";
import { PlayerAvatar } from "../../../components/PlayerAvatar";
import { useFetchPlayerQuery } from "../../../providers/GraphqlProvider";
import { Player } from "../../../types/Player";
import { getCnbPlayer, getCnbPlayers } from "../../../utils/data/graphql";

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
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* {error && <p>Error: {JSON.stringify(error)}</p>} */}
      <AnimateFadeIn>
        <PlayerAvatar player={player} />
      </AnimateFadeIn>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getCnbPlayers();

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
