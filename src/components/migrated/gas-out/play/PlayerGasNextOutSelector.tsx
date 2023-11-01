import { useMemo } from "react";
import styled from "styled-components";
import { GasGame } from "../../../../services/migrated/gas-out/types";
import { PlayerAvatar } from "../../../PlayerAvatar";
import { FONT_FAMILY } from "../../../../colors";

const Container = styled.div`
  display: flex;
  gap: 10vw;
  transition: opacity 300ms ease-out;
  flex-wrap: wrap;
  padding-bottom: 50px;
`;

const Heading = styled.h3``;

const PlayerSelectContainer = styled.div`
  position: relative;
`;

const PlayerSelectButton = styled.button``;

const TotalVotes = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  padding: 0.5rem;
  background-color: darkred;
  border-radius: 50%;
  color: white;
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${FONT_FAMILY.numeric};
  pointer-events: none;
`;

type Props = {
  gasGame: GasGame;
  selectPlayer: (playerId: string) => void;
};

export const PlayerGasNextOutSelector = ({
  gasGame,
  selectPlayer,
}: Props): JSX.Element => {
  const eligiblePlayers = useMemo(() => {
    return gasGame.allPlayers.filter((p) => p.status === "alive");
  }, [gasGame]);

  return (
    <>
      <Heading>Who&lsquo;s next?</Heading>
      <Container>
        {eligiblePlayers.map((p) => {
          const totalVotes = gasGame.allPlayers
            .map((p) => p.guesses.nextPlayerOutGuess)
            .filter((g) => g === p.player.id).length;

          return (
            <PlayerSelectContainer key={p.player.id}>
              <PlayerSelectButton onClick={() => selectPlayer(p.player.id)}>
                <PlayerAvatar playerId={p.player.id} size="thumbnail" />
                {p.player.name}
              </PlayerSelectButton>
              {totalVotes > 0 && <TotalVotes>{totalVotes}</TotalVotes>}
            </PlayerSelectContainer>
          );
        })}
      </Container>
    </>
  );
};
