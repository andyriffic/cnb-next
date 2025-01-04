import Image from "next/image";
import { useRouter } from "next/router";
import qrcode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Heading,
  SmallHeading,
  SubHeading,
  ThemedPrimaryButton,
} from "../../components/Atoms";
import { DebugPlayerJoin } from "../../components/DebugPlayerJoin";
import { JoinedPlayer } from "../../components/JoinedPlayer";
import { NumericValue } from "../../components/NumericValue";
import { AvatarSize } from "../../components/PlayerAvatar";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { Appear } from "../../components/animations/Appear";
import { Attention } from "../../components/animations/Attention";
import { useSomethingWhenArraySizeChanges } from "../../components/hooks/useSomethingWhenArraySizeChanges";
import { useSound } from "../../components/hooks/useSound";
import { WaitingPlayerNamesHint } from "../../components/pages/join/WaitingPlayerNamesHint";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { SocketIoService, useSocketIo } from "../../providers/SocketIoProvider";
import { PlayerWallet } from "../../services/betting/types";
import { PlayerGroup } from "../../services/player-join/types";
import THEME from "../../themes";
import { getSuggestedGame } from "../../utils/join/joinHelper";
import { shuffleArray } from "../../utils/random";
import {
  getAiOverlordSpectatorUrl,
  getGasOutSpectatorUrl,
  getNumberCrunchSpectatorUrl,
  getPlayRootUrl,
  getRockPaperScissorsGameSpectatorUrl,
  urlWithTeamQueryParam,
} from "../../utils/url";
import { AudienceGameSelection } from "../../components/pages/join/AudienceGameSelection";
import { deductAvailableCoinFromPlayer } from "../../utils/api";
import { Coins } from "../../components/Coins";

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
  background-color: ${THEME.tokens.colours.primaryBackground};
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
  background-color: ${THEME.tokens.colours.secondaryBackground};
  padding: 4rem;
  overflow-y: scroll;
`;

const GameInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
`;

const SuggestedText = styled.span`
  color: ${THEME.tokens.colours.primaryText}};
  text-transform: uppercase;
  font-size: 0.8rem;
`;

const PlayerHintContainer = styled.div``;

const GameSelectorContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  flex-shrink: 0;
`;

const CoinContainer = styled.div`
  font-size: 1.5rem;
  text-align: center;
`;

export type GameTypes =
  | "rps"
  | "rps-quick"
  | "balloon"
  | "balloon-quick"
  | "ai"
  | "number-crunch";

const availableGameTypes: GameTypes[] = ["rps", "balloon", "number-crunch"];

const GAME_CONFIG: {
  [key in GameTypes]: { displayName: string; canTakeCoins: boolean };
} = {
  rps: { displayName: "Betting 🎲", canTakeCoins: false },
  "rps-quick": { displayName: "Betting (quick)", canTakeCoins: false },
  balloon: { displayName: "Balloon 🎈", canTakeCoins: true },
  "balloon-quick": { displayName: "Balloon (quick)", canTakeCoins: false },
  ai: { displayName: "AI Overlord", canTakeCoins: false },
  "number-crunch": { displayName: "Number Crunch 💯", canTakeCoins: true },
};

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
  ["number-crunch"]: createNumberCrunchGame,
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
  const [showWaitingPlayersHint, setShowWaitingPlayersHint] = useState(false);
  const [suggestedGame] = useState(getSuggestedGame(new Date()));

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWaitingPlayersHint(true);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
                <Image src={qrCodeUrl} alt="" width={250} height={250} />
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
          {THEME.components.JoinScreenDecoration && (
            <JoinDetailsDecorationContainer>
              {THEME.components.JoinScreenDecoration}
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
              <GameInfoContainer>
                <PlayerHintContainer>
                  {showWaitingPlayersHint && (
                    <WaitingPlayerNamesHint joinedPlayers={group.players} />
                  )}
                </PlayerHintContainer>
                <GameSelectorContainer>
                  {suggestedGame ? (
                    <>
                      {availableGameTypes.map((gameType) => {
                        return (
                          <Attention
                            key={gameType}
                            animation="slow-vibrate"
                            animate={gameType === suggestedGame}
                          >
                            <div>
                              <ThemedPrimaryButton
                                highlight={gameType === suggestedGame}
                                disabled={group.playerIds.length < 3}
                                onClick={() => {
                                  gameCreators[gameType](
                                    group,
                                    socketService,
                                    getName,
                                    team
                                  ).then((gameUrl) => {
                                    router.push(
                                      urlWithTeamQueryParam(gameUrl, team)
                                    );
                                  });
                                }}
                              >
                                {gameType === suggestedGame && (
                                  <>
                                    <SuggestedText>
                                      🌟Recommended🌟
                                    </SuggestedText>
                                    <br />
                                  </>
                                )}
                                {GAME_CONFIG[gameType].displayName}
                              </ThemedPrimaryButton>
                              {GAME_CONFIG[gameType].canTakeCoins && (
                                <CoinContainer>
                                  <Coins totalCoins={1} />
                                </CoinContainer>
                              )}
                            </div>
                          </Attention>
                        );
                      })}
                    </>
                  ) : (
                    <AudienceGameSelection
                      playerIds={group.playerIds}
                      onGameSelected={(gameType) =>
                        gameCreators[gameType](
                          group,
                          socketService,
                          getName,
                          team
                        ).then((gameUrl) => {
                          router.push(urlWithTeamQueryParam(gameUrl, team));
                        })
                      }
                    />
                  )}
                </GameSelectorContainer>
              </GameInfoContainer>
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
      (game) => {
        game.allPlayers
          .filter((p) => p.advantage)
          .map((p) => p.player.id)
          .forEach(deductAvailableCoinFromPlayer);
        resolve(getGasOutSpectatorUrl(game.id));
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
      (game) => {
        resolve(getGasOutSpectatorUrl(game.id));
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

function createNumberCrunchGame(
  group: PlayerGroup,
  socketIoService: SocketIoService
): Promise<GameUrl> {
  return new Promise((resolve) => {
    socketIoService.numberCrunch.createGame(group.id, group.players, (game) => {
      game.players
        .filter((p) => p.advantage)
        .map((p) => p.id)
        .forEach(deductAvailableCoinFromPlayer);
      resolve(getNumberCrunchSpectatorUrl(game.id));
    });
  });
}
