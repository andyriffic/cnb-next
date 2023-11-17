import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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
  getGasOutPlayerUrl,
  playersBettingGameUrl,
  playersRockPaperScissorsGameUrl,
} from "../../../utils/url";

function numbersOnly(str: string): string {
  return str.replace(/\D/g, "");
}

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const autoJoinId = (router.query.autoJoinId as string) || "";
  const playerId = router.query.playerId as string;
  const joinedId = router.query.joinedId as string;
  const { groupJoin, rockPaperScissors, groupBetting, aiOverlord, gasGame } =
    useSocketIo();
  const [groupId, setGroupId] = useState(autoJoinId || joinedId || "");

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
        (g) =>
          g.id === joinedGroup.id && g.players.find((p) => p.id === playerId)
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

  const relatedGasGame = useMemo(() => {
    return (
      joinedGroup &&
      gasGame.gasGames.find(
        (g) =>
          g.id === joinedGroup.id &&
          g.allPlayers.map((p) => p.player.id).includes(playerId)
      )
    );
  }, [joinedGroup, gasGame.gasGames, playerId]);

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
              legacyBehavior
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
              legacyBehavior
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
              legacyBehavior
            >
              <PrimaryLinkButton>Play Ai Overlord</PrimaryLinkButton>
            </Link>
          )}
          {relatedGasGame && (
            <Link
              href={getGasOutPlayerUrl(playerId, relatedGasGame.id)}
              passHref={true}
              legacyBehavior
            >
              <PrimaryLinkButton>Play Balloon</PrimaryLinkButton>
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
