import Image from "next/image";
import { useRouter } from "next/router";
import qrcode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Heading, PrimaryButton, SubHeading } from "../../components/Atoms";
import { DebugPlayerJoin } from "../../components/DebugPlayerJoin";
import { CenterSpaced, EvenlySpaced } from "../../components/Layouts";
import { NumericValue } from "../../components/NumericValue";
import { PlayerAvatar } from "../../components/PlayerAvatar";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { Appear } from "../../components/animations/Appear";
import { useSomethingWhenArraySizeChanges } from "../../components/hooks/useSomethingWhenArraySizeChanges";
import { useSound } from "../../components/hooks/useSound";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { SocketIoService, useSocketIo } from "../../providers/SocketIoProvider";
import { PlayerWallet } from "../../services/betting/types";
import { PlayerGroup } from "../../services/player-join/types";
import { selectRandomOneOf, shuffleArray } from "../../utils/random";
import {
  getAiOverlordSpectatorUrl,
  getGasOutSpectatorUrl,
  getPlayRootUrl,
  getRockPaperScissorsGameSpectatorUrl,
} from "../../utils/url";

const JoinedPlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90vw;
  flex-wrap: wrap;
`;

type GameTypes = "rps" | "balloon" | "ai";
const availableRandomGames: GameTypes[] = ["rps", "balloon"];

const gameCreators: {
  [key in GameTypes]: (
    group: PlayerGroup,
    socketIoService: SocketIoService,
    getName: (playerId: string) => string
  ) => Promise<GameUrl>;
} = {
  rps: createRockPaperScissorsWithBettingGame,
  balloon: createBallonGame,
  ai: createAiGame,
};

const JoinedPlayerItem = styled.div``;

// const gasGameEnabled = isClientSideFeatureEnabled("balloon");

function Page() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const socketService = useSocketIo();
  const { getName } = usePlayerNames();
  const { play, loop } = useSound();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const joinMusic = loop("join-music");
    joinMusic.play();
    return () => {
      joinMusic.stop();
    };
  }, [loop]);

  useEffect(() => {
    const joinUrl = `${window.location.protocol}//${
      window.location.host
    }${getPlayRootUrl(groupId)}`;
    qrcode.toDataURL(joinUrl, (error, url) => {
      console.info("URL", joinUrl);
      console.info("QR generated URL", url);
      setQrCodeUrl(url);
    });
  }, [groupId]);

  const group = useMemo(() => {
    return socketService.groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [socketService.groupJoin.playerGroups, groupId]);

  useSomethingWhenArraySizeChanges(group?.playerIds, () =>
    play("join-player-joined")
  );

  return (
    <SpectatorPageLayout debug={group && <DebugPlayerJoin group={group} />}>
      <CenterSpaced stacked={true} style={{ margin: "2rem 0 2rem" }}>
        <SubHeading>test.finx-rocks.com/play</SubHeading>
        <Heading style={{ fontSize: "5rem" }}>
          <NumericValue>{groupId}</NumericValue>
        </Heading>
      </CenterSpaced>
      {!group && "Invalid group 😭"}
      {group && (
        <CenterSpaced stacked={true}>
          <SubHeading>
            Joined players (
            <NumericValue>{group.playerIds.length}</NumericValue>)
          </SubHeading>
          <JoinedPlayerContainer>
            {group.playerIds.map((pid) => (
              <JoinedPlayerItem key={pid}>
                <Appear animation="flip-in">
                  <PlayerAvatar playerId={pid} size="small" />
                </Appear>
              </JoinedPlayerItem>
            ))}
          </JoinedPlayerContainer>
          <EvenlySpaced>
            <PrimaryButton
              disabled={group.playerIds.length < 2}
              onClick={() => {
                gameCreators
                  .rps(group, socketService, getName)
                  .then((gameUrl) => {
                    router.push(gameUrl);
                  });
              }}
            >
              Betting game
            </PrimaryButton>
            <PrimaryButton
              disabled={group.playerIds.length < 2}
              onClick={() => {
                gameCreators
                  .balloon(group, socketService, getName)
                  .then((gameUrl) => {
                    router.push(gameUrl);
                  });
              }}
            >
              Balloon game
            </PrimaryButton>
            <PrimaryButton
              disabled={group.playerIds.length < 2}
              onClick={() => {
                gameCreators
                  .ai(group, socketService, getName)
                  .then((gameUrl) => {
                    router.push(gameUrl);
                  });
              }}
            >
              AI Overlord (BETA ⚠️)
            </PrimaryButton>
          </EvenlySpaced>
          <Heading>OR</Heading>
          <PrimaryButton
            disabled={group.playerIds.length < 2}
            onClick={() => {
              const randomGame = selectRandomOneOf(availableRandomGames);
              gameCreators[randomGame](group, socketService, getName).then(
                (gameUrl) => {
                  router.push(gameUrl);
                }
              );
            }}
          >
            Random
          </PrimaryButton>
        </CenterSpaced>
      )}
      {qrCodeUrl && (
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "10vw",
            height: "10vw",
          }}
        >
          <Image layout="fill" src={qrCodeUrl} alt="" />
        </div>
      )}
    </SpectatorPageLayout>
  );
}

export default Page;

type GameUrl = string;

function createRockPaperScissorsWithBettingGame(
  group: PlayerGroup,
  socketIoService: SocketIoService,
  getName: (playerId: string) => string
): Promise<GameUrl> {
  return new Promise((resolve) => {
    const randomisedPlayerIds = shuffleArray(group.playerIds);
    const playerId1 = randomisedPlayerIds[0]!;
    const playerId2 = randomisedPlayerIds[1]!;

    const STARTING_WALLET_BALANCE = 0;

    const bettingPlayerWallets = group.playerIds
      .filter((pid) => pid !== playerId1 && pid !== playerId2)
      .map<PlayerWallet>((pid) => ({
        playerId: pid,
        value: STARTING_WALLET_BALANCE,
      }));

    socketIoService.rockPaperScissors.createRPSGame(
      {
        id: group.id,
        playerIds: [playerId1, playerId2],
      },
      (gameId) => {
        socketIoService.groupBetting.createGroupBettingGame(
          gameId,
          [
            {
              id: playerId1,
              name: getName(playerId1),
              odds: 1,
              betReturn: "oddsOnly",
            },
            {
              id: "draw",
              name: "Draw",
              odds: 1,
              betReturn: "oddsOnly",
            },
            {
              id: playerId2,
              name: getName(playerId2),
              odds: 1,
              betReturn: "oddsOnly",
            },
          ],
          bettingPlayerWallets,
          () => resolve(getRockPaperScissorsGameSpectatorUrl(gameId))
        );
      }
    );
  });
}

function createBallonGame(
  group: PlayerGroup,
  socketIoService: SocketIoService
): Promise<GameUrl> {
  return new Promise((resolve) => {
    socketIoService.gasGame.createGasGame(
      group.playerIds,
      group.id,
      (gameId) => {
        resolve(getGasOutSpectatorUrl(gameId));
      }
    );
  });
}

function createAiGame(
  group: PlayerGroup,
  socketIoService: SocketIoService
): Promise<GameUrl> {
  return new Promise((resolve) => {
    socketIoService.aiOverlord.createAiOverlordGame(
      group.id,
      group.playerIds,
      (gameId) => {
        resolve(getAiOverlordSpectatorUrl(gameId));
      }
    );
  });
}
