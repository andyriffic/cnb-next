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
  SubHeading,
} from "../../../components/Atoms";
import { PlayerPageLayout } from "../../../components/PlayerPageLayout";
import { useSocketIo } from "../../../providers/SocketIoProvider";
import {
  getAiOverlordPlayerUrl,
  playersBettingGameUrl,
  playersRockPaperScissorsGameUrl,
} from "../../../utils/url";

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
  const autoJoinId = (router.query.autoJoinId as string) || "";
  const playerId = router.query.playerId as string;
  const joinedId = router.query.joinedId as string;
  const { groupJoin, rockPaperScissors, groupBetting, aiOverlord } =
    useSocketIo();
  const [groupId, setGroupId] = useState(autoJoinId);

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

  const relatedGroupBettingGame = useMemo(() => {
    return (
      joinedGroup &&
      groupBetting.bettingGames.find(
        (g) =>
          g.id === joinedGroup.id &&
          g.playerWallets.map((w) => w.playerId).includes(playerId)
      )
    );
  }, [groupBetting.bettingGames, joinedGroup, playerId]);

  const relatedAiOverlordGame = useMemo(() => {
    return (
      joinedGroup &&
      aiOverlord.aiOverlordGames.find(
        (game) =>
          game.gameId === joinedGroup.id &&
          game.opponents.map((o) => o.playerId).includes(playerId)
      )
    );
  }, [aiOverlord.aiOverlordGames, joinedGroup, playerId]);

  return (
    <PlayerPageLayout headerContent={<>Header</>} playerId={playerId}>
      {joinedGroup ? (
        <div>
          <Heading>You&lsquo;ve joined 👍</Heading>
          <SubHeading>{joinedGroup.id}</SubHeading>
          {relatedRPSGame ? (
            <Link
              href={playersRockPaperScissorsGameUrl(
                playerId,
                relatedRPSGame.id
              )}
              passHref={true}
            >
              <PrimaryLinkButton>Play RPS</PrimaryLinkButton>
            </Link>
          ) : (
            <p>Waiting for game to start</p>
          )}
          {relatedGroupBettingGame && (
            <Link
              href={playersBettingGameUrl(playerId, relatedGroupBettingGame.id)}
              passHref={true}
            >
              <PrimaryLinkButton>Play Betting</PrimaryLinkButton>
            </Link>
          )}
          {relatedAiOverlordGame && (
            <Link
              href={getAiOverlordPlayerUrl(
                playerId,
                relatedAiOverlordGame.gameId
              )}
              passHref={true}
            >
              <PrimaryLinkButton>Play Ai Overlord</PrimaryLinkButton>
            </Link>
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
