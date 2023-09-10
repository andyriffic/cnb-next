import { useEffect } from "react";
import { useSound } from "../hooks/useSound";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";

export const useZombieRunSound = (zombieGame: ZombieRunGame) => {
  const { play } = useSound();

  // Game state sounds
  useEffect(() => {
    if (zombieGame.gameStatus === ZombieRunGameStatus.PLAYERS_RUNNING) {
      play("zombie-run-players-running");
    }
    if (zombieGame.gameStatus === ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING) {
      play("zombie-run-zombie-moving");
    }
    if (zombieGame.gameStatus === ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING) {
      console.log(
        "playing zombie sounds for bitten zombies",
        zombieGame.zombies
      );
      zombieGame.zombies.forEach((item, index) => {
        console.log("playing zombie sound");
        setTimeout(() => play("zombie-run-player-zombie-moving"), index * 400);
      });
    }
  }, [zombieGame, play]);

  // Game action sounds
  useEffect(() => {
    //Original zombie bites player
    if (
      [
        ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING,
        ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING,
      ].includes(zombieGame.gameStatus) &&
      zombieGame.survivors.filter((p) => p.gotBitten).length > 0
    ) {
      play("zombie-run-player-bitten");
    }
  }, [zombieGame, play]);

  // useEffect(() => {
  //   //Player zombie bites player
  //   if (
  //     zombieGame.gameStatus === ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING &&
  //     zombieGame.survivors.filter((p) => p.gotBitten).length > 0
  //   ) {
  //     play("zombie-run-player-bitten");
  //   }
  // }, [zombieGame, play]);
};
