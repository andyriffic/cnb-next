import { GetServerSideProps } from "next";
import SnakesAndLadders from "../components/snakes-and-ladders";
import { getTeamDetails, TeamId } from "../teams";
import { Player } from "../types/Player";
import {
  getPlayerSnakesAndLaddersDetails,
  PlayerDetails,
} from "../types/Player";
import {
  getAllPlayers,
  updatePlayer,
  updatePlayerLegacyTags,
} from "../utils/data/aws-dynamodb-players";
import { sortByPlayerName } from "../utils/sort";

type Props = { players: Player[]; teamId: TeamId };

export default function Page({ players, teamId }: Props) {
  return <SnakesAndLadders players={players} teamId={teamId} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const allPlayers = await getAllPlayers();
  const { team } = query;

  const participants = allPlayers
    ? allPlayers
        .filter(
          (player) => getPlayerSnakesAndLaddersDetails(player).isParticipant,
        )
        .filter(
          (player) =>
            !team ||
            player.details?.team?.toLowerCase() ===
              (team as string).toLowerCase(),
        )
        .sort(sortByPlayerName)
    : [];

  return {
    props: {
      players: participants,
      teamId: getTeamDetails(team as string | undefined).id,
    },
  };
};
