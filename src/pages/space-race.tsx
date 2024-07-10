import { GetServerSideProps } from "next";
import SpaceRaceScreen from "../components/space-race";
import { SETTINGS_PLAYER_ID } from "../constants";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb";
import { selectRandomOneOf } from "../utils/random";
import { sortByPlayerName } from "../utils/sort";

type Props = { players: Player[] };

function Page({ players }: Props) {
  return <SpaceRaceScreen players={players} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const allPlayers = await getAllPlayers();

  const activePlayers = allPlayers
    ? allPlayers
        // .filter((p) => !p.details?.retired)
        .filter((p) => p.id !== SETTINGS_PLAYER_ID)
        .filter((p) => ["andy", "alex", "albert_s"].includes(p.id))
        .map<Player>((p) => ({
          ...p,
          details: {
            ...p.details,
            spaceRace: {
              xCoordinate: 0,
              yCoordinate: selectRandomOneOf([1, 2, 3, 4, 5]),
              movesRemaining: selectRandomOneOf([4, 5, 6, 7]),
            },
          },
        })) //TODO: let other players join
    : [];

  return {
    props: {
      players: activePlayers.sort(sortByPlayerName),
    },
  };
};

export default Page;
