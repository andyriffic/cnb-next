import { useMemo } from "react";
import styled from "styled-components";
import { Player } from "../../../types/Player";
import { Pill, SmallHeading } from "../../Atoms";
import { Appear } from "../../animations/Appear";
import { PlayerNameDetails } from "../../../pages/join/[groupId]";

const NameListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
`;

type Props = {
  joinedPlayers: Player[];
  regularPlayers: PlayerNameDetails[];
};

export const WaitingPlayerNamesHint = ({
  joinedPlayers,
  regularPlayers,
}: Props) => {
  const regularPlayersNotJoined = useMemo(
    () =>
      regularPlayers.filter((n) => !joinedPlayers.find((p) => p.id === n.id)),
    [joinedPlayers, regularPlayers]
  );

  // const show = useMemo(() => joinedPlayers.length > 6, [joinedPlayers.length]);

  return (
    <Appear animation="text-focus-in">
      <SmallHeading>Still waiting on?</SmallHeading>
      <NameListContainer>
        {regularPlayersNotJoined.map((pn) => (
          <Pill key={pn.id}>{pn.name}</Pill>
        ))}
      </NameListContainer>
    </Appear>
  );
};
