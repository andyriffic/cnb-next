import React from "react";
import styled from "styled-components";
import { GasPlayer } from "../../../../services/migrated/gas-out/types";
import { PlayerAvatar } from "../../../PlayerAvatar";

const Container = styled.div`
  display: flex;
  gap: 10vw;
  transition: opacity 300ms ease-out;
  flex-wrap: wrap;
  padding-bottom: 50px;
`;

const Heading = styled.h3``;

const PlayerSelectButton = styled.button``;

type Props = {
  eligiblePlayers: GasPlayer[];
  selectPlayer: (playerId: string) => void;
};

export const PlayerGasNextOutSelector = ({
  eligiblePlayers,
  selectPlayer,
}: Props): JSX.Element => {
  return (
    <>
      <Heading>Who&lsquo;s next?</Heading>
      <Container>
        {eligiblePlayers.map((p) => (
          <PlayerSelectButton
            key={p.player.id}
            onClick={() => selectPlayer(p.player.id)}
          >
            <PlayerAvatar playerId={p.player.id} size="thumbnail" />
            {p.player.name}
          </PlayerSelectButton>
        ))}
      </Container>
    </>
  );
};
