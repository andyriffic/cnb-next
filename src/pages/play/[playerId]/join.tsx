import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  BigInput,
  Heading,
  Label,
  PrimaryButton,
  PrimaryLinkButton,
} from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import { playersRockPaperScissorsGameUrl } from "../../../utils/url";

const CenterAlignContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function numbersOnly(str: string): string {
  return str.replace(/\D/g, "");
}

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const { groupJoin, rockPaperScissors } = useSocketIo();
  const [groupId, setGroupId] = useState("");
  const playerId = router.query.playerId as string;
  const joinedId = router.query.joinedId as string;

  const joinedGroup = useMemo(() => {
    if (joinedId && joinedId === groupId) {
      return groupJoin.playerGroups.find(
        (g) => g.id === joinedId && g.playerIds.includes(playerId)
      );
    }
  }, [groupId, joinedId, playerId, groupJoin.playerGroups]);

  const relatedRPSGame = useMemo(() => {
    return (
      joinedGroup &&
      rockPaperScissors.activeRPSGames.find(
        (g) => g.id === joinedGroup.id && g.playerIds.includes(playerId)
      )
    );
  }, [rockPaperScissors.activeRPSGames, joinedGroup, playerId]);

  return (
    <PlayerPageLayout headerContent={<>Header</>}>
      {joinedGroup ? (
        <div>
          <Heading>You&lsquo;ve joined!</Heading>
          {relatedRPSGame ? (
            <Link
              href={playersRockPaperScissorsGameUrl(
                playerId,
                relatedRPSGame.id
              )}
              passHref={true}
            >
              <PrimaryLinkButton>Play</PrimaryLinkButton>
            </Link>
          ) : (
            <p>Waiting for game to start</p>
          )}
        </div>
      ) : (
        <div>
          <Heading>Join a game</Heading>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              groupJoin.joinGroup(playerId, groupId, (groupId) =>
                router.push(`/play/${playerId}/join?joinedId=${groupId}`)
              );
            }}
          >
            <fieldset>
              <Label htmlFor="group-id-input">Join Code</Label>
              <BigInput
                id="group-id-input"
                type="tel"
                maxLength={4}
                value={groupId}
                onChange={(e) => setGroupId(numbersOnly(e.target.value))}
                autoComplete="off"
                autoFocus
              ></BigInput>
              <PrimaryButton type="submit" disabled={groupId.length !== 4}>
                JOIN
              </PrimaryButton>
            </fieldset>
          </form>
        </div>
      )}
    </PlayerPageLayout>
  );
}

export default Page;
