import { Howl } from "howler";
import { useEffect, useMemo, useRef } from "react";
import { GasGame } from "../../../../services/migrated/gas-out/types";
import { useSound } from "../../../hooks/useSound";
import { selectRandomOneOf } from "../../../../utils/random";

export function useGasSound(game: GasGame | undefined) {
  const playingSounds = useRef<{ [id: string]: Howl }>({});

  const { play, loop } = useSound();
  const lastPlayerPlayedCardRef = useRef<string | undefined>();

  const pressedCount = useMemo<number>(() => {
    if (!game || game.gasCloud.exploded) {
      return 0;
    }

    return game.gasCloud.pressed;
  }, [game]);

  const exploded = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }

    return game.gasCloud.exploded;
  }, [game]);

  const finishedPressingRiskyCard = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }

    return (
      game.currentPlayer.pressesRemaining === 0 &&
      !!game.currentPlayer.cardPlayed &&
      game.currentPlayer.cardPlayed.type === "risky" &&
      game.alivePlayersIds.includes(game.currentPlayer.id)
    );
  }, [game]);

  const hasWinner = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }

    return !!game.winningPlayerId;
  }, [game]);

  const cardPlayed = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }

    if (!game.currentPlayer.cardPlayed) {
      return false;
    }

    if (lastPlayerPlayedCardRef.current === game.currentPlayer.id) {
      return false;
    }

    lastPlayerPlayedCardRef.current = game.currentPlayer.id;
    return true;
  }, [game]);

  const gameInProgress = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }
    if (game.gasCloud.exploded || !!game.winningPlayerId) {
      return false;
    }

    return true;
  }, [game]);

  const headToHead = useMemo<boolean>(() => {
    if (!game) {
      return false;
    }
    return (
      !game.currentPlayer.cardPlayed &&
      game.allPlayers.filter((p) => p.status === "alive").length === 2
    );
  }, [game]);

  const cursed = useMemo(() => {
    if (!game) {
      return false;
    }

    const currentPlayer = game.allPlayers.find(
      (p) => p.player.id === game.currentPlayer.id
    );

    if (!currentPlayer) {
      return false;
    }

    return !!currentPlayer.curse;
  }, [game]);

  useEffect(() => {
    if (pressedCount > 0) {
      const intensity = pressedCount / 100 + 0.5;
      // play("gas-inflate", { rate: intensity });
      play("gas-inflate"); //TODO: intensity not here when migrating game, can add in the future
    }
  }, [play, pressedCount]);

  useEffect(() => {
    if (cursed) {
      play("gas-cursed");
    }
  }, [cursed, play]);

  useEffect(() => {
    if (exploded) {
      playingSounds.current["background-music"] &&
        playingSounds.current["background-music"].stop();
      play("gas-explode");
      play("gas-player-die");
    }
  }, [exploded, play]);

  // useEffect(() => {
  //   if (cardPlayed) {
  //     play('GasPlayNumberCard');
  //   }
  // }, [cardPlayed]);

  useEffect(() => {
    if (hasWinner) {
      play("gas-winner");
    }
  }, [hasWinner, play]);

  useEffect(() => {
    if (finishedPressingRiskyCard) {
      play("gas-play-survived-risk");
    }
  }, [finishedPressingRiskyCard, play]);

  useEffect(() => {
    if (!!playingSounds.current["head-to-head"]) {
      return;
    }

    if (headToHead) {
      playingSounds.current["head-to-head"] = play("gas-head-to-head-round");
    }
  }, [headToHead, play]);

  useEffect(() => {
    if (gameInProgress) {
      playingSounds.current["background-music"] = loop("gas-background-music");
      playingSounds.current["background-music"].play();
    }
  }, [gameInProgress, loop]);
}
