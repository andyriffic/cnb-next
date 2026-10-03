import { GetServerSideProps } from "next";
import SnakesAndLadders from "../components/snakes-and-ladders";
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

type Props = { players: Player[] };

export default function Page({ players }: Props) {
  return <SnakesAndLadders players={players} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const allPlayers = await getAllPlayers();

  const participants = allPlayers
    ? allPlayers
        .filter(
          (player) => getPlayerSnakesAndLaddersDetails(player).isParticipant,
        )
        .sort(sortByPlayerName)
    : [];

  return { props: { players: participants } };
};
