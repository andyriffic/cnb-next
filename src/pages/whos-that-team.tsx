import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Appear } from "../components/animations/Appear";
import { useSound } from "../components/hooks/useSound";
import { PlayerAvatar } from "../components/PlayerAvatar";
import THEME from "../themes";
import { Player } from "../types/Player";
import { getAllPlayers } from "../utils/data/aws-dynamodb-players";

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

const PlayersContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

const PlayerContainer = styled.div<{ reveal: boolean }>`
  padding: 3rem;
  ${({ reveal }) =>
    !reveal &&
    css`
      filter: brightness(0) invert(0);
    `}
  transform: translate3d(5%, 5%, 0);
  transition: filter 200ms linear;
`;

const MainTextContainer = styled.div`
  text-align: center;
  padding: 0 5rem 5rem 0;
`;

const PlayerName = styled.div`
  margin: 0 0 2rem 0;
  padding: 0;
  font-family: ${THEME.tokens.fonts.body};
  font-size: 2rem;
  line-height: 1;
  text-transform: uppercase;
  font-weight: bold;
  color: #fecb03;
  text-align: center;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #000;
`;

const TeamName = styled.div`
  font-size: 20rem;
  line-height: 1;
  color: #fecb03;
  margin: 0;
  padding: 0;
  font-family: ${THEME.tokens.fonts.feature};
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: #000;
`;

type Props = {
  teamName: string;
  players: Player[];
  continueUrl: string | null;
};

export default function Page({ players, continueUrl, teamName }: Props) {
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

  return (
    <Background>
      <PlayersContainer>
        {players.map((player) => (
          <PlayerContainer reveal={reveal} key={player.id}>
            <PlayerAvatar playerId={player.id} size="small" />
            <Appear show={reveal} animation="flip-in">
              <PlayerName>{player.name}</PlayerName>
            </Appear>
          </PlayerContainer>
        ))}
      </PlayersContainer>
      {teamName && (
        <MainTextContainer
          style={{ position: "absolute", bottom: 0, right: 0 }}
        >
          <Appear show={reveal} animation="flip-in">
            <TeamName>{teamName}</TeamName>
          </Appear>
        </MainTextContainer>
      )}
    </Background>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { team, continueUrl } = query;

  if (!team) {
    return {
      props: {
        players: [],
        teamName: "",
        continueUrl: continueUrl ? (continueUrl as string) : null,
      },
    };
  }

  const players = await getAllPlayers().then((allPlayers) =>
    !!allPlayers
      ? allPlayers.filter(
          (p) =>
            p.details?.team?.toLowerCase() === (team as string).toLowerCase(),
        )
      : [],
  );

  return {
    props: {
      players,
      teamName: team as string,
      continueUrl: continueUrl ? (continueUrl as string) : null,
    },
  };
};
