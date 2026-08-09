import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";

import tinycolor from "tinycolor2";
import {
  FeatureHeading,
  FeatureSubHeading,
  Heading,
  SubHeading,
  ThemedPrimaryButton,
} from "../../components/Atoms";
import { CenterSpaced } from "../../components/Layouts";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { Appear } from "../../components/animations/Appear";
import { useSocketIo } from "../../providers/SocketIoProvider";
import cinbyWave from "../../assets/cinby-wave.png";
import { getTeamDetails } from "../../teams";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TeamJoinButton = styled.button<{ squadColor: string }>`
  display: block;
  border: 5px solid
    ${(props) => tinycolor(props.squadColor).darken(10).toString()};
  border-radius: 1rem;
  cursor: pointer;
  padding: 1rem;
  min-width: 200px;
  background-color: ${(props) => props.squadColor};

  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      tinycolor(props.squadColor).darken(10).toString()};
    border-color: ${(props) => props.squadColor};
  }
`;

const TEAMS = [getTeamDetails("corgi"), getTeamDetails("finvengers")];

function Page() {
  const router = useRouter();
  const { groupJoin } = useSocketIo();

  const startNewGame = useCallback(
    (team?: string) => {
      console.log("Creating New Player Group...");

      groupJoin.createPlayerGroup((groupId) => {
        console.log("Group Created", groupId);
        router.push(`/join/${groupId}${team ? `?team=${team}` : ""}`);
      });
    },
    [groupJoin, router],
  );

  return (
    <SpectatorPageLayout>
      <Container>
        <CenterSpaced style={{ alignItems: "flex-end" }}>
          <Appear animation="flip-in">
            <Image src={cinbyWave} alt="" height={200} />
          </Appear>
          <div style={{ marginBottom: "0rem" }}>
            <FeatureSubHeading style={{ marginBottom: "0rem" }}>
              Welcome to
            </FeatureSubHeading>
            <FeatureHeading>CNB</FeatureHeading>
          </div>
        </CenterSpaced>
        <CenterSpaced style={{ marginTop: "2rem" }}>
          <SubHeading>Select your team</SubHeading>
        </CenterSpaced>
        <CenterSpaced style={{ marginTop: "1rem" }}>
          {TEAMS.map((team, index) => (
            <Appear
              key={team.id}
              animation="roll-in-left"
              delayMilliseconds={index * 200 + 500}
            >
              <TeamJoinButton
                squadColor={team.backgroundColor}
                onClick={() => startNewGame(team.id)}
              >
                <Image
                  src={team.mascotImageUrl}
                  alt=""
                  width={100}
                  height={100}
                />
                <SubHeading style={{ color: team.textColor }}>
                  {team.name}
                </SubHeading>
              </TeamJoinButton>
            </Appear>
          ))}
        </CenterSpaced>
      </Container>
    </SpectatorPageLayout>
  );
}

export default Page;
