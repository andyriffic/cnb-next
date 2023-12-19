import Image from "next/image";
import { useRouter } from "next/router";
import qrcode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Heading,
  PrimaryButton,
  SmallHeading,
  SubHeading,
  ThemedPrimaryButton,
} from "../../components/Atoms";
import { DebugPlayerJoin } from "../../components/DebugPlayerJoin";
import { JoinedPlayer } from "../../components/JoinedPlayer";
import { CenterSpaced, EvenlySpaced } from "../../components/Layouts";
import { NumericValue } from "../../components/NumericValue";
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
  urlWithTeamQueryParam,
} from "../../utils/url";
import THEME from "../../themes/types";
import THEME_COMPONENTS from "../../themes/themed-components";
import { AvatarSize } from "../../components/PlayerAvatar";

const JoinedPlayerContainer = styled.div`
  display: flex;
  flex: 0 1;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const SplitScreenContainer = styled.div`
  display: flex;
  height: 100vh;
  align-items: stretch;
`;

const JoinDetailsContainer = styled.div`
  width: 30%;
  background-color: ${THEME.colours.primaryBackground};
  display: flex;
  flex-direction: column;
`;

const JoinDetailsInfoContainer = styled.div`
  padding: 4rem;
  flex-grow: 1;
`;

const JoinDetailsDecorationContainer = styled.div``;

const WaitingRoomContainer = styled.div`
  flex: 1;
  background-color: ${THEME.colours.secondaryBackground};
  padding: 4rem;
  overflow-y: scroll;
`;

const GameButttonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
`;

type GameTypes = "rps" | "rps-quick" | "balloon" | "balloon-quick" | "ai";
const availableRandomGames: GameTypes[] = ["rps", "balloon"];

const gameCreators: {
  [key in GameTypes]: (
    group: PlayerGroup,
    socketIoService: SocketIoService,
    getName: (playerId: string) => string,
    team: string | undefined
  ) => Promise<GameUrl>;
} = {
  rps: createRockPaperScissorsWithBettingGame(3),
  ["rps-quick"]: createRockPaperScissorsWithBettingGame(3),
  ["balloon-quick"]: createBallonGameQuick,
  balloon: createBallonGameNormal,
  ai: createAiGame,
};

const JoinedPlayerItem = styled.div``;

// const gasGameEnabled = isClientSideFeatureEnabled("balloon");

function Page() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const team = router.query.team as string;
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
      setQrCodeUrl(url);
    });
  }, [groupId]);

  const group = useMemo(() => {
    return socketService.groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [socketService.groupJoin.playerGroups, groupId]);

  useSomethingWhenArraySizeChanges(group?.playerIds, () =>
    play("join-player-joined")
  );

  const playerAvatarSize: AvatarSize =
    (group && group.players.length > 20 ? "thumbnail" : "small") || "small";

  return (
    <SpectatorPageLayout debug={group && <DebugPlayerJoin group={group} />}>
      <SplitScreenContainer>
        <JoinDetailsContainer>
          <JoinDetailsInfoContainer>
            <SmallHeading style={{ textAlign: "right", marginBottom: "2rem" }}>
              Come in!
            </SmallHeading>
            {qrCodeUrl && (
              <div style={{ textAlign: "right", marginBottom: "2rem" }}>
                <Image src={qrCodeUrl} alt="" width={200} height={200} />
              </div>
            )}

            <Heading
              style={{
                fontSize: "5rem",
                textAlign: "right",
                marginBottom: "2rem",
              }}
            >
              <NumericValue>{groupId}</NumericValue>
            </Heading>
            <SubHeading style={{ textAlign: "right" }}>
              cnb.finx-rocks.com/play
            </SubHeading>
          </JoinDetailsInfoContainer>
          {THEME_COMPONENTS.JoinScreenDecoration && (
            <JoinDetailsDecorationContainer>
              {THEME_COMPONENTS.JoinScreenDecoration}
            </JoinDetailsDecorationContainer>
          )}
        </JoinDetailsContainer>
        <WaitingRoomContainer>
          {group && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                <SmallHeading style={{ marginBottom: "2rem" }}>
                  The waiting room ({group.playerIds.length})
                </SmallHeading>

                <JoinedPlayerContainer>
                  {group.players.map((player) => (
                    <JoinedPlayerItem key={player.id}>
                      <Appear animation="flip-in">
                        <JoinedPlayer
                          player={player}
                          team={team}
                          avatarSize={playerAvatarSize}
                        />
                      </Appear>
                    </JoinedPlayerItem>
                  ))}
                </JoinedPlayerContainer>
              </div>
              <GameButttonContainer>
                <ThemedPrimaryButton
                  disabled={group.playerIds.length < 2}
                  onClick={() => {
                    gameCreators
                      .rps(group, socketService, getName, team)
                      .then((gameUrl) => {
                        router.push(urlWithTeamQueryParam(gameUrl, team));
                      });
                  }}
                >
                  Betting 🎲
                </ThemedPrimaryButton>
                <ThemedPrimaryButton
                  disabled={group.playerIds.length < 2}
                  onClick={() => {
                    gameCreators
                      .balloon(group, socketService, getName, team)
                      .then((gameUrl) => {
                        router.push(urlWithTeamQueryParam(gameUrl, team));
                      });
                  }}
                >
                  Balloon 🎈
                </ThemedPrimaryButton>
              </GameButttonContainer>
            </div>
          )}
        </WaitingRoomContainer>
      </SplitScreenContainer>
      {!group && "Invalid group 😭"}
    </SpectatorPageLayout>
  );
}

export default Page;

type GameUrl = string;

function createRockPaperScissorsWithBettingGame(
  spectatorTargetGuesses: number
) {
  return function (
    group: PlayerGroup,
    socketIoService: SocketIoService,
    getName: (playerId: string) => string
  ): Promise<GameUrl> {
    return new Promise((resolve) => {
      const randomisedPlayerIds = shuffleArray(group.players);
      const player1 = randomisedPlayerIds[0]!;
      const player2 = randomisedPlayerIds[1]!;

      const STARTING_WALLET_BALANCE = 0;

      const bettingPlayerWallets = group.players
        .filter((p) => p.id !== player1.id && p.id !== player2.id)
        .map<PlayerWallet>((p) => ({
          player: p,
          value: STARTING_WALLET_BALANCE,
        }));

      socketIoService.rockPaperScissors.createRPSGame(
        {
          id: group.id,
          players: [player1, player2],
          spectatorTargetGuesses,
        },
        (gameId) => {
          socketIoService.groupBetting.createGroupBettingGame(
            gameId,
            [
              {
                id: player1.id,
                name: player1.name,
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
                id: player2.id,
                name: player2.name,
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
  };
}

function createBallonGameNormal(
  group: PlayerGroup,
  socketIoService: SocketIoService,
  getName: (playerId: string) => string,
  team: string | undefined
): Promise<GameUrl> {
  return new Promise((resolve) => {
    socketIoService.gasGame.createGasGame(
      group.playerIds,
      group.id,
      team,
      "normal",
      (gameId) => {
        resolve(getGasOutSpectatorUrl(gameId));
      }
    );
  });
}

function createBallonGameQuick(
  group: PlayerGroup,
  socketIoService: SocketIoService,
  getName: (playerId: string) => string,
  team: string | undefined
): Promise<GameUrl> {
  return new Promise((resolve) => {
    socketIoService.gasGame.createGasGame(
      group.playerIds,
      group.id,
      team,
      "quick",
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
