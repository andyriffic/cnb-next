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
import { useSocketIo } from "../../providers/SocketIoProvider";
import { PlayerWallet } from "../../services/betting/types";
import { shuffleArray } from "../../utils/random";
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

const JoinedPlayerItem = styled.div``;

// const gasGameEnabled = isClientSideFeatureEnabled("balloon");

function Page() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { groupJoin, rockPaperScissors, groupBetting, aiOverlord, gasGame } =
    useSocketIo();
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
    return groupJoin.playerGroups.find((g) => g.id === groupId);
  }, [groupJoin.playerGroups, groupId]);

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

                rockPaperScissors.createRPSGame(
                  {
                    id: group.id,
                    playerIds: [playerId1, playerId2],
                  },
                  (gameId) => {
                    groupBetting.createGroupBettingGame(
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
                      () =>
                        router.push(
                          getRockPaperScissorsGameSpectatorUrl(gameId)
                        )
                    );
                  }
                );
              }}
            >
              Betting game
            </PrimaryButton>
            <PrimaryButton
              disabled={group.playerIds.length < 2}
              onClick={() =>
                gasGame.createGasGame(group.playerIds, (gameId) => {
                  router.push(getGasOutSpectatorUrl(gameId));
                })
              }
            >
              Balloon game
            </PrimaryButton>
            <PrimaryButton
              disabled={group.playerIds.length < 2}
              onClick={() =>
                aiOverlord.createAiOverlordGame(
                  groupId,
                  group.playerIds,
                  (gameId) => {
                    router.push(getAiOverlordSpectatorUrl(gameId));
                  }
                )
              }
            >
              AI Overlord (BETA ⚠️)
            </PrimaryButton>
          </EvenlySpaced>
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
