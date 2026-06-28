import styled from "styled-components";
import App from "next/app";
import { GasGame } from "../../../services/migrated/gas-out/types";
import { PlayerAvatar } from "../../PlayerAvatar";
import { Appear } from "../../animations/Appear";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const PlayerContainer = styled.div`
  width: 45%;
`;
const GoodbyeText = styled.div`
  font-size: 0.7rem;
`;

type Props = {
  gasGame: GasGame;
};

export function GoodbyePlayers({ gasGame }: Props): JSX.Element {
  return (
    <Container>
      {gasGame.allPlayers
        .filter((p) => p.status === "dead")
        .filter((p) => p.team === "Xian")
        .map((player) => (
          <PlayerContainer key={player.player.id}>
            <Appear show={true} animation="flip-in">
              <PlayerAvatar playerId={player.player.id} size="thumbnail" />
              <GoodbyeText>
                Farewell,{" "}
                <strong style={{ fontWeight: "bold" }}>
                  {player.player.name}
                </strong>{" "}
                🤗
              </GoodbyeText>
            </Appear>
          </PlayerContainer>
        ))}
    </Container>
  );
}
