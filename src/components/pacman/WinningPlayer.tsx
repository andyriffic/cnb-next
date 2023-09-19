import styled from "styled-components";
import { useEffect } from "react";
import { PlayerAvatar } from "../PlayerAvatar";
import { Heading } from "../Atoms";
import { Appear } from "../animations/Appear";
import { useSound } from "../hooks/useSound";
import { PacManPlayer } from "./types";

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: white;
  border: 1rem solid black;
  border-radius: 5rem;
  padding: 2rem;
`;

type Props = {
  winningPlayer?: PacManPlayer;
};

export function WinningPlayer({ winningPlayer }: Props) {
  const { play } = useSound();

  useEffect(() => {
    winningPlayer && play("gas-winner");
  }, [play, winningPlayer]);

  return winningPlayer ? (
    <Container>
      <Appear animation="roll-in-left" delayMilliseconds={2000}>
        <Heading>Winner!</Heading>
        <PlayerAvatar playerId={winningPlayer.player.id} size="medium" />
      </Appear>
    </Container>
  ) : null;
}
