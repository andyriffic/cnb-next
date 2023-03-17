import { GetStaticPaths, GetStaticProps } from "next";
import styled from "styled-components";
import { AnimateFadeInLeft } from "../../../components/animations/FadeInLeft";
import { AnimateFadeInRight } from "../../../components/animations/FadeInRight";
import { PlayerAvatar } from "../../../components/PlayerAvatar";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { Player } from "../../../types/Player";
import { updatePlayerDetails } from "../../../utils/api";
import { getAllPlayers, getPlayer } from "../../../utils/data/aws-dynamodb";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const PlayerProfileContainer = styled.div`
  position: relative;
`;

const PlayerName = styled.div`
  background-color: #2f70af;
  padding: 1rem;
  color: #f5f5f5;
  /* border: 0.5rem solid #b9848c; */
  border-radius: 1rem;
  font-size: 3rem;
  width: auto;
  display: inline-block;
  text-transform: uppercase;
  position: absolute;
  bottom: 10vh;
  left: 0;
`;

type Props = {
  player: Player;
};

const updateDetails = (player: Player) => {
  updatePlayerDetails(player.id, { gameMoves: 5 }).then(() =>
    console.log("player updated")
  );
};

function Page({ player }: Props) {
  return (
    <SpectatorPageLayout
      debug={
        <div>
          <button onClick={() => updateDetails(player)}>Hello</button>
        </div>
      }
    >
      <CenterAlignContainer>
        <PlayerProfileContainer>
          <AnimateFadeInLeft>
            <PlayerAvatar playerId={player.id} />
          </AnimateFadeInLeft>
          <AnimateFadeInRight delayMilliseconds={0}>
            <PlayerName>{player.name}</PlayerName>
          </AnimateFadeInRight>
        </PlayerProfileContainer>
      </CenterAlignContainer>
    </SpectatorPageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getAllPlayers();

  if (!players) {
    return { paths: [], fallback: false };
  }

  return {
    paths: players.map((player) => ({
      params: {
        playerId: player.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const player = await getPlayer(params!.playerId! as string);
  console.log("PLAYER", player);
  return {
    props: { player },
  };
};

export default Page;
