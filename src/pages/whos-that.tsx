import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Appear } from "../components/animations/Appear";
import { useSound } from "../components/hooks/useSound";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { Player } from "../types/Player";
import { incrementPlayersWhosThatCountFetch } from "../utils/api";
import { getAllPlayers, getPlayer } from "../utils/data/aws-dynamodb";
import { selectRandomOneOf } from "../utils/random";
import THEME from "../themes";

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

const TextContainer = styled.div`
  text-align: right;
  padding: 0 5rem 5rem 0;
`;

const PlayerName = styled.div`
  margin: 0 0 2rem 0;
  padding: 0;
  font-family: ${THEME.tokens.fonts.body};
  font-size: 10rem;
  line-height: 1;
  text-transform: uppercase;
  font-weight: bold;
  color: #fecb03;
  -webkit-text-stroke-width: 7px;
  -webkit-text-stroke-color: #38649d;
`;

const PlayerRole = styled.div`
  font-size: 6rem;
  line-height: 0;
  color: #fecb03;
  margin: 0;
  padding: 0;
  font-family: ${THEME.tokens.fonts.feature};
`;

type Props = {
  player?: Player;
  continueUrl: string | null;
};

export default function Page({ player, continueUrl }: Props) {
  const updatedWhosThatCount = useRef(false);
  const [reveal, setReveal] = useState(false);
  const router = useRouter();
  const { play } = useSound();

  useEffect(() => {
    play("whos-that");
    const timeout = setTimeout(() => {
      setReveal(true);
    }, 3200);

    return () => clearTimeout(timeout);
  }, [play]);

  useEffect(() => {
    if (!continueUrl) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(continueUrl);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [continueUrl, router]);

  useEffect(() => {
    if (!player || updatedWhosThatCount.current) {
      return;
    }
    updatedWhosThatCount.current = true;
    console.log("incrementing whos that count for", player.name);
    incrementPlayersWhosThatCountFetch(player.id);
  }, [player]);

  if (!player) {
    return (
      <div>
        Soz, I couldn{"'"}t find a player to show you for some reason ¯\_(ツ)_/¯
      </div>
    );
  }

  return (
    <Background>
      <PlayerContainer reveal={reveal}>
        <PlayerAvatar playerId={player.id} />
      </PlayerContainer>
      <TextContainer style={{ position: "absolute", bottom: 0, right: 0 }}>
        <Appear show={reveal} animation="flip-in">
          <PlayerName>{player.name}</PlayerName>
          {player.details?.role && (
            <PlayerRole>{player.details?.role}</PlayerRole>
          )}
        </Appear>
      </TextContainer>
    </Background>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { playerId, continueUrl } = query;

  if (playerId) {
    const player = await getPlayer(playerId as string);

    return {
      props: {
        player: player ? player : undefined,
        continueUrl: continueUrl ? (continueUrl as string) : null,
      },
    };
  }

  const allPlayers = (await getAllPlayers()) || [];
  const allValidPlayers = allPlayers.filter(
    (p) => !p.tags.includes("no-whos-that")
  );
  const allViewCounts = allValidPlayers.map(
    (p) => p.details?.whosThatCount || 0
  );

  const lowestViewCount = Math.min(...allViewCounts);

  const lowestViewCountPlayers = allValidPlayers.filter(
    (p) => (p.details?.whosThatCount || 0) === lowestViewCount
  );

  return {
    props: {
      player:
        lowestViewCountPlayers.length > 0
          ? selectRandomOneOf(lowestViewCountPlayers)
          : null,
      continueUrl: continueUrl ? (continueUrl as string) : null,
    },
  };
};
