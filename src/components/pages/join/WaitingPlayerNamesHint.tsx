import { useMemo, useState } from "react";
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

const PillWithDismissButton = styled(Pill)``;

const DismissButton = styled.button`
  background: none;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  color: #222;
`;

type Props = {
  joinedPlayers: Player[];
  regularPlayers: PlayerNameDetails[];
};

export const WaitingPlayerNamesHint = ({
  joinedPlayers,
  regularPlayers,
}: Props) => {
  const [playerIdsNotHereToday, setPlayerIdsNotHereToday] = useState<string[]>(
    [],
  );

  const regularPlayersNotJoined = useMemo(
    () =>
      regularPlayers
        .filter((n) => !joinedPlayers.find((p) => p.id === n.id))
        .filter((n) => !playerIdsNotHereToday.includes(n.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [joinedPlayers, regularPlayers, playerIdsNotHereToday],
  );

  // const show = useMemo(() => joinedPlayers.length > 6, [joinedPlayers.length]);

  return (
    <Appear animation="text-focus-in">
      <SmallHeading>Still waiting on?</SmallHeading>
      <NameListContainer>
        {regularPlayersNotJoined.map((pn) => (
          <PillWithDismissButton key={pn.id}>
            {pn.name}
            <DismissButton
              title="Not here today"
              onClick={() => {
                setPlayerIdsNotHereToday((prev) => [...prev, pn.id]);
              }}
            >
              x
            </DismissButton>
          </PillWithDismissButton>
        ))}
      </NameListContainer>
    </Appear>
  );
};
