import { UseSpaceRace } from "./useSpaceRace";

type Props = {
  useSpaceRace: UseSpaceRace;
};
export const DebugSpaceRace = ({ useSpaceRace }: Props) => {
  return (
    <div>
      {Object.keys(useSpaceRace.spaceRaceGame.spacePlayers).map((playerId) => (
        <div key={playerId}>
          {playerId}
          <div>
            <button onClick={() => useSpaceRace.plotPlayerCourse(playerId, -2)}>
              Up 2
            </button>
            <button onClick={() => useSpaceRace.plotPlayerCourse(playerId, -1)}>
              Up 1
            </button>
            <br />
            <button onClick={() => useSpaceRace.plotPlayerCourse(playerId, 0)}>
              Forward
            </button>
            <br />
            <button onClick={() => useSpaceRace.plotPlayerCourse(playerId, 1)}>
              Down 1
            </button>
            <button onClick={() => useSpaceRace.plotPlayerCourse(playerId, 2)}>
              Down 2
            </button>
            <br />
            {/* 
            <button onClick={() => useSpaceRace.movePlayerVertically(playerId)}>
              Vertical
            </button>
            <button
              onClick={() => useSpaceRace.movePlayerHorizontally(playerId)}
            >
              Horizontal
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};
