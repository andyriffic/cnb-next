import { useMemo } from "react";
import styled from "styled-components";
import { Player } from "../../../types/Player";
import { Pill, SmallHeading } from "../../Atoms";
import { Appear } from "../../animations/Appear";

const NameListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
`;

const REGULAR_PLAYER_NAMES = [
  "Andy",
  "Nina",
  "Cathy",
  "Kathleen",
  "Brett",
  "Chris",
  "Byron",
  "Stacey",
  "Ashlee",
  "Michelle",
  "Michelle L",
  // "Shuming",
  // "Albert",
  // "Ben",
  // "Xueming",
  // "Yishen",
  // "Sixiao",
  // "Pingsheng",
];

type Props = {
  joinedPlayers: Player[];
};

export const WaitingPlayerNamesHint = ({ joinedPlayers }: Props) => {
  const regularPlayersNotJoined = useMemo(
    () =>
      REGULAR_PLAYER_NAMES.filter(
        (n) => !joinedPlayers.find((p) => p.name === n)
      ),
    [joinedPlayers]
  );

  const show = useMemo(() => joinedPlayers.length > 6, [joinedPlayers.length]);

  return show ? (
    <Appear animation="text-focus-in">
      <SmallHeading>Still waiting on?</SmallHeading>
      <NameListContainer>
        {regularPlayersNotJoined.map((pn) => (
          <Pill key={pn}>{pn}</Pill>
        ))}
      </NameListContainer>
    </Appear>
  ) : null;
};
