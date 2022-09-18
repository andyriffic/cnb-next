import { useRouter } from "next/router";
import { PlayerAvatar } from "../../../components/PlayerAvatar";
import { useFetchPlayerQuery } from "../../../providers/GraphqlProvider";

function Page() {
  const router = useRouter();
  const { playerId } = router.query;
  const { data, fetching, error } = useFetchPlayerQuery(playerId as string);

  if (fetching) {
    return <h3>Finding player...</h3>;
  }

  if (!(data && data.player)) {
    return <h3>Player not found :(</h3>;
  }

  return (
    <div>
      {error && <p>Error: {JSON.stringify(error)}</p>}
      <PlayerAvatar player={data.player} />
    </div>
  );
}

export default Page;
