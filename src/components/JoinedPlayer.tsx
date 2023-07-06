import styled from "styled-components";
import { useEffect, useState } from "react";
import { Player } from "../types/Player";
import { fetchGetPlayer } from "../utils/api";
import { PlayerAvatar } from "./PlayerAvatar";
import { AnimateFadeInLeft } from "./animations/FadeInLeft";
import { Appear } from "./animations/Appear";

const Label = styled.div`
  background-color: goldenrod;
  color: black;
  padding: 0.5rem;
  font-size: 0.8rem;
  border-radius: 1rem;
  border: white solid 0.2rem;
  text-transform: uppercase;
  display: inline-block;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
`;

type Props = {
  playerId: string;
  team: string | undefined;
};

export function JoinedPlayer({ playerId, team }: Props) {
  const [player, setPlayer] = useState<Player | undefined>();

  useEffect(() => {
    fetchGetPlayer(playerId).then((playerOrNull) => {
      setPlayer(playerOrNull);
    });
  }, [playerId]);

  return (
    <div>
      <PlayerAvatar playerId={playerId} size="small" />
      {player && team && player.details?.team === team && (
        <Appear animation="text-focus-in">
          <Label>{player.details.team}</Label>
        </Appear>
      )}
    </div>
  );
}
