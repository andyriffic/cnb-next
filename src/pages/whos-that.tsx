import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Appear } from "../components/animations/Appear";
import { useSound } from "../components/hooks/useSound";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { Player } from "../types/Player";
import { getAllPlayers, getPlayer } from "../utils/data/aws-dynamodb";
import { selectRandomOneOf } from "../utils/random";

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: no-repeat url("/images/pokemon-background.jpg") center center;
  background-size: cover;
  background-color: #000;
`;

const PlayerContainer = styled.div<{ reveal: boolean }>`
  ${({ reveal }) =>
    !reveal &&
    css`
      filter: brightness(0) invert(0);
    `}
  transform: translate3d(5%, 5%, 0);
  transition: filter 200ms linear;
`;

const PlayerName = styled.div`
  margin: 0;
  padding: 0;
  font-family: "Pokemon Solid", sans-serif;
  font-size: 10rem;
  text-transform: uppercase;
  font-weight: bold;
  position: fixed;
  bottom: 0;
  right: 10%;
  color: #fecb03;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: #38649d;
  letter-spacing: 0.5rem;
`;

type Props = {
  player?: Player;
};

export default function Page({ player }: Props) {
  const [reveal, setReveal] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    play("whos-that");
    const timeout = setTimeout(() => {
      setReveal(true);
    }, 3200);

    return () => clearTimeout(timeout);
  }, [play]);

  if (!player) {
    return <div>Soz</div>;
  }

  return (
    <Background>
      <PlayerContainer reveal={reveal}>
        <PlayerAvatar playerId={player.id} />
      </PlayerContainer>
      <Appear show={reveal} animation="flip-in">
        <PlayerName>{player.name}</PlayerName>
      </Appear>
    </Background>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { playerId } = query;

  if (playerId) {
    const player = await getPlayer(playerId as string);

    return {
      props: { player },
    };
  }

  const allPlayers = await getAllPlayers();
  // const player = await getPlayer("andy");

  return {
    props: { player: allPlayers ? selectRandomOneOf(allPlayers) : undefined },
  };
};
