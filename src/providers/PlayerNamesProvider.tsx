import React, { useCallback, useMemo } from "react";
import { useFetchAllPlayersQuery } from "./GraphqlProvider";

type PlayerNames = { [playerId: string]: string };

type PlayerNamesService = {
  names: PlayerNames;
  getName: (playerId: string) => string;
};

type Props = {
  children: React.ReactNode;
};

const PlayerNamesContext = React.createContext<PlayerNamesService | undefined>(
  undefined
);

export const PlayerNamesProvider = ({ children }: Props): JSX.Element => {
  const playerNamesQuery = useFetchAllPlayersQuery();

  const names = useMemo(() => {
    return (
      playerNamesQuery.data?.players.reduce<PlayerNames>((acc, player) => {
        acc[player.id] = player.name;
        return acc;
      }, {}) || {}
    );
  }, [playerNamesQuery]);

  const getName = useCallback(
    (id: string) => {
      return names[id] || "";
    },
    [names]
  );

  return (
    <PlayerNamesContext.Provider
      value={{
        names,
        getName,
      }}
    >
      {children}
    </PlayerNamesContext.Provider>
  );
};

export function usePlayerNames(): PlayerNamesService {
  const context = React.useContext(PlayerNamesContext);
  if (context === undefined) {
    throw new Error(
      "useCachedPlayerNames must be used within a CachedPlayerNamesProvider"
    );
  }
  return context;
}
