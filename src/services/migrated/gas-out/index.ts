import { pipe } from "fp-ts/lib/function";
import { getPlayerAvailableCoins, Player } from "../../../types/Player";
import {
  WeightedItem,
  selectRandomOneOf,
  selectWeightedRandomOneOf,
  shuffleArray,
} from "../../../utils/random";
import {
  CardHistory,
  CardType,
  CurseType,
  DeathType,
  Direction,
  EffectType,
  GasCard,
  GasGame,
  GasGameType,
  GasPlayer,
  GlobalEffect,
  PlayerKilledBy,
} from "./types";

export function createGame({
  id,
  players,
  team,
  gameType,
}: {
  id: string;
  players: Player[];
  team: string | undefined;
  gameType: GasGameType;
}): GasGame {
  const randomPlayerOrder = shuffleArray(players);
  return {
    id,
    gameType,
    allPlayers: randomPlayerOrder.map((p) => createGasPlayer(p, gameType)),
    alivePlayersIds: randomPlayerOrder.map((p) => p.id),
    deadPlayerIds: [],
    direction: "right",
    currentPlayer: {
      id: randomPlayerOrder[0]!.id,
      pressesRemaining: 0,
    },
    gasCloud: {
      pressed: 0,
      exploded: false,
    },
    pointsMap: createPointsMap(players.length),
    moveHistory: [],
    turnCount: 0,
    team,
    superGuessInEffect: false,
    potentialSuperGuessStillAvailable: false,
  };
}

function createPointsMap(totalPlayerCount: number): number[] {
  const POINTS_BRACKETS = 3;
  const WINNER_POINTS = 5;

  const pointsStep = Math.round(totalPlayerCount / POINTS_BRACKETS);

  return [...Array(totalPlayerCount)].map((_, i) => {
    if (i === totalPlayerCount - 1) {
      return WINNER_POINTS;
    }
    const points = Math.trunc(i / pointsStep + 1);

    return points;
  });
}

export function moveToNextAlivePlayerWithExtraCardRules(
  game: GasGame
): GasGame {
  return pipe(
    game,
    moveToNextAlivePlayer,
    applyCursesToCurrentPlayer,
    applyBoomerangDeath
    // applyBombDeath
  );
}

// export function moveToNextAlivePlayerWithReverseDeath(game: GasGame): GasGame {
//   const gameWithNextPlayer = applyCursesToCurrentPlayer(
//     moveToNextAlivePlayer(game)
//   );

//   if (gameWithNextPlayer.alivePlayersIds.length === 2) {
//     return gameWithNextPlayer;
//   }

//   if (gameWithNextPlayer.moveHistory.length < 2) {
//     return gameWithNextPlayer;
//   }

//   const lastCardMove = gameWithNextPlayer.moveHistory[0]!;
//   const secondLastCarMove = gameWithNextPlayer.moveHistory[1]!;

//   if (
//     lastCardMove.cardPlayed.type === "reverse" &&
//     secondLastCarMove.cardPlayed.type === "reverse" &&
//     secondLastCarMove.playerId === gameWithNextPlayer.currentPlayer.id
//   ) {
//     return explode(gameWithNextPlayer, "boomerang");
//   }

//   return gameWithNextPlayer;
// }

function applyBoomerangDeath(game: GasGame): GasGame {
  if (game.alivePlayersIds.length === 2) {
    return game;
  }

  if (game.moveHistory.length < 2) {
    return game;
  }

  const lastCardMove = game.moveHistory[0]!;
  const secondLastCarMove = game.moveHistory[1]!;

  if (
    lastCardMove.cardPlayed.type === "reverse" &&
    secondLastCarMove.cardPlayed.type === "reverse" &&
    secondLastCarMove.playerId === game.currentPlayer.id
  ) {
    return explode(game, {
      playerId: lastCardMove.playerId,
      deathType: "boomerang",
    });
  }

  return game;
}

function applyBombDeath(game: GasGame): GasGame {
  if (game.alivePlayersIds.length === 2) {
    return game;
  }

  if (game.moveHistory.length < 1) {
    return game;
  }

  const lastDeadPlayerId = game.deadPlayerIds[game.deadPlayerIds.length - 1];
  const lastCardMove = game.moveHistory[0]!;

  if (lastDeadPlayerId) {
    const lastDeadPlayer = getPlayerOrThrow(game, lastDeadPlayerId);

    if (
      lastDeadPlayer.killedBy &&
      lastDeadPlayer.killedBy.deathType === "bomb" &&
      lastDeadPlayer.killedBy.playerId === lastCardMove.playerId
    ) {
      return game;
    }
  }

  if (
    lastCardMove.cardPlayed.type === "bomb" &&
    game.alivePlayersIds.includes(lastCardMove.playerId)
  ) {
    const randomAlivePlayerId = selectRandomOneOf(
      game.alivePlayersIds.filter((pid) => pid !== lastCardMove.playerId)
    );

    return explode(
      {
        ...game,
        currentPlayer: {
          id: randomAlivePlayerId,
          pressesRemaining: 0,
        },
      },
      { playerId: lastCardMove.playerId, deathType: "bomb" }
    );
  }

  return game;
}

export function moveToNextAlivePlayer(game: GasGame): GasGame {
  if (game.allPlayers.every((p) => p.status === "dead")) {
    //Guard just in case for now
    return game;
  }

  if (!!game.winningPlayerId) {
    // Game already has a winner
    return game;
  }

  let updatedGame = game;
  let currentPlayer = getPlayerOrThrow(game, game.currentPlayer.id);

  do {
    updatedGame = moveToNextPlayer(updatedGame);
    currentPlayer = getPlayerOrThrow(updatedGame, updatedGame.currentPlayer.id);
  } while (currentPlayer.status === "dead");

  return incrementTurnCount(updatedGame);
}

function incrementTurnCount(game: GasGame): GasGame {
  return {
    ...game,
    turnCount: game.turnCount + 1,
  };
}

function applyCursesToCurrentPlayer(game: GasGame): GasGame {
  if (game.alivePlayersIds.length === 2) {
    return game;
  }

  if (game.moveHistory.length < 1) {
    return game;
  }

  const lastCardMove = game.moveHistory[0]!;

  if (
    (lastCardMove.cardPlayed.type === "risky" ||
      lastCardMove.cardPlayed.type === "curse-all-fives") &&
    game.alivePlayersIds.includes(lastCardMove.playerId)
  ) {
    const currentPlayer = getPlayerOrThrow(game, game.currentPlayer.id);
    const cursedPlayer: GasPlayer = {
      ...currentPlayer,
      curse:
        lastCardMove.cardPlayed.type === "risky" ? "double-press" : "all-fives",
    };

    return {
      ...game,
      allPlayers: updatePlayerInList(
        game.allPlayers,
        applyCurseEffectsToPlayer(cursedPlayer)
      ),
    };
  }

  return game;
}

function applyCurseEffectsToPlayer(player: GasPlayer): GasPlayer {
  if (!player.curse) {
    return player;
  }

  switch (player.curse) {
    case "double-press":
      return {
        ...player,
        cards: player.cards.map((c) => {
          if (c.type === "press") {
            return { ...c, presses: c.presses * 2 };
          }
          return c;
        }),
      };
    case "all-fives":
      return {
        ...player,
        cards: [
          createCard("press", 5),
          createCard("press", 5),
          createCard("press", 5),
        ],
      };
  }
}

export function moveToNextPlayer(game: GasGame): GasGame {
  if (game.currentPlayer.pressesRemaining > 0) {
    // throw 'Game still has presses remaining'
    return game;
  }

  const currentPlayerIndex = game.allPlayers.findIndex(
    (p) => p.player.id === game.currentPlayer.id
  );
  const unvalidatedNextPlayerIndex =
    game.direction === "left" ? currentPlayerIndex - 1 : currentPlayerIndex + 1;

  const maxPlayerIndex = game.allPlayers.length - 1;

  let nextPlayerId: string | undefined;

  switch (game.direction) {
    case "right": {
      if (unvalidatedNextPlayerIndex > maxPlayerIndex) {
        nextPlayerId = game.allPlayers[0]!.player.id;
      }
      break;
    }
    case "left": {
      if (unvalidatedNextPlayerIndex < 0) {
        nextPlayerId = game.allPlayers[maxPlayerIndex]!.player.id;
      }
      break;
    }
  }

  if (!nextPlayerId) {
    nextPlayerId = game.allPlayers[unvalidatedNextPlayerIndex]!.player.id;
  }

  return {
    ...game,
    currentPlayer: {
      id: nextPlayerId,
      pressesRemaining: 0,
    },
  };
}

function giveEffectPowerToPlayer(
  game: GasGame,
  playerId: string,
  effect: EffectType
): GasGame {
  const player = getPlayerOrThrow(game, playerId);

  return {
    ...game,
    allPlayers: updatePlayerInList(game.allPlayers, {
      ...player,
      effectPower: effect,
    }),
  };
}

function removeEffectPowerFromPlayer(game: GasGame, playerId: string): GasGame {
  const player = getPlayerOrThrow(game, playerId);

  return {
    ...game,
    allPlayers: updatePlayerInList(game.allPlayers, {
      ...player,
      effectPower: undefined,
    }),
  };
}

function activateEffect(game: GasGame, effect: GlobalEffect): GasGame {
  return {
    ...game,
    globalEffect: effect,
  };
}

export function playEffect(game: GasGame, effect: GlobalEffect): GasGame {
  return removeEffectPowerFromPlayer(
    activateEffect(game, effect),
    effect.playedByPlayerId
  );
}

function deactivateGlobalEffect(game: GasGame): GasGame {
  return {
    ...game,
    globalEffect: undefined,
  };
}

export function resetCloud(game: GasGame): GasGame {
  if (!game.gasCloud.exploded) {
    // throw 'Resetting cloud but cloud has not exploded';
    return game;
  }

  return {
    ...game,
    currentPlayer: {
      ...game.currentPlayer,
      pressesRemaining: 0,
      cardPlayed: undefined,
    },
    gasCloud: {
      pressed: 0,
      exploded: false,
    },
  };
}

function assignMvps(game: GasGame): GasGame {
  if (!game.winningPlayerId) {
    return game;
  }

  return {
    ...game,
    mvpPlayerIds: {
      mostCorrectGuesses: getMostCorrectGuessesPlayerId(game),
      mostPresses: getMostPressesPlayerId(game),
    },
  };
}

function getMostPressesPlayerId(game: GasGame): string[] {
  const mostPressesCount = Math.max(
    ...game.allPlayers.map((p) => p.totalPresses)
  );

  if (mostPressesCount === 0) {
    return [];
  }

  return game.allPlayers
    .filter((p) => p.totalPresses === mostPressesCount)
    .map((p) => p.player.id);
}

function getMostCorrectGuessesPlayerId(game: GasGame): string[] {
  const mostCorrectGuessesCount = Math.max(
    ...game.allPlayers.map((p) => p.guesses.correctGuessCount)
  );

  if (mostCorrectGuessesCount === 0) {
    return [];
  }

  return game.allPlayers
    .filter((p) => p.guesses.correctGuessCount === mostCorrectGuessesCount)
    .map((p) => p.player.id);
}

function assignWinner(game: GasGame): GasGame {
  if (!!game.winningPlayerId) {
    //Winner already assigned
    return game;
  }

  const allAlivePlayers = game.allPlayers.filter((p) => p.status === "alive");

  if (allAlivePlayers.length > 1) {
    // No winner yet
    return game;
  }

  if (allAlivePlayers.length === 0) {
    // This shouldn't happen
    throw "No alive players when trying to find winner :(";
  }

  const maxPointsByOtherPlayers = Math.max(
    ...game.allPlayers.map<number>((p) => p.points)
  );

  const winningPlayer: GasPlayer = {
    ...allAlivePlayers[0]!,
    status: "winner",
    finishedPosition: 1,
    points: maxPointsByOtherPlayers + 3,
  };

  return {
    ...game,
    winningPlayerId: winningPlayer.player.id,
    allPlayers: updatePlayerInList(game.allPlayers, winningPlayer),
  };
}

export function makeNextPlayerOutGuess(
  game: GasGame,
  playerId: string,
  guessPlayerId: string
): GasGame {
  const guessingPlayer = getPlayerOrThrow(game, playerId);
  const updatedGuessingPlayer: GasPlayer = {
    ...guessingPlayer,
    guesses: {
      ...guessingPlayer.guesses,
      nextPlayerOutGuess: guessPlayerId,
    },
  };

  const updatedPlayers = updatePlayerInList(
    game.allPlayers,
    updatedGuessingPlayer
  );

  return setSuperGuessBonus({
    ...game,
    allPlayers: updatedPlayers.map((p) => {
      return {
        ...p,
        guesses: {
          ...p.guesses,
          nominatedCount: totalOutNominationsCount(updatedPlayers, p.player.id),
        },
      };
    }),
  });
}

function setSuperGuessBonus(game: GasGame): GasGame {
  const allDeadPlayers = game.allPlayers.filter((p) => p.status === "dead");
  if (allDeadPlayers.length === 0) {
    return { ...game, superGuessInEffect: false };
  }

  const allDeadPlayersHaveGuessed = allDeadPlayers.every(
    (p) => p.guesses.nextPlayerOutGuess !== undefined
  );
  const firstDeadPlayerGuess = allDeadPlayers[0]!.guesses.nextPlayerOutGuess;

  return {
    ...game,
    superGuessInEffect:
      allDeadPlayersHaveGuessed &&
      allDeadPlayers.every(
        (p) => p.guesses.nextPlayerOutGuess === firstDeadPlayerGuess
      ),
    potentialSuperGuessStillAvailable: canYouStillSuperGuess(game),
  };
}

function canYouStillSuperGuess(game: GasGame): boolean {
  // const noPlayersDead = game.allPlayers.every((p) => p.status !== "dead");

  if (game.deadPlayerIds.length < 2) {
    return false;
  }

  // const somePlayersNotGuessed = game.allPlayers
  //   .filter((p) => p.status === "dead")
  //   .some((p) => p.guesses.nextPlayerOutGuess === undefined);

  const guessedPlayerGuesses = game.allPlayers
    .filter((p) => p.status === "dead")
    .filter((p) => !!p.guesses.nextPlayerOutGuess)
    .map((p) => p.guesses.nextPlayerOutGuess);

  const allGuessPlayersGuessedSamePlayer = guessedPlayerGuesses.every(
    (p) => p === guessedPlayerGuesses[0]
  );

  const allPlayersGuessed =
    guessedPlayerGuesses.length === game.deadPlayerIds.length;

  return !allPlayersGuessed && allGuessPlayersGuessedSamePlayer;
}

function totalOutNominationsCount(
  allPlayers: GasPlayer[],
  playerId: string
): number {
  return allPlayers.filter((p) => p.guesses.nextPlayerOutGuess === playerId)
    .length;
}

export function press(game: GasGame): GasGame {
  if (game.currentPlayer.pressesRemaining === 0 || game.gasCloud.exploded) {
    return game;
  }

  const explodedWeights: WeightedItem<boolean>[] = [
    { weight: game.gasCloud.pressed + 1, item: true },
    { weight: 100, item: false },
  ];

  const exploded =
    game.currentPlayer.id === "carol"
      ? false
      : selectWeightedRandomOneOf(explodedWeights);

  return pipe(
    exploded
      ? explode(game, {
          playerId: game.currentPlayer.id,
          deathType: "balloon",
        })
      : game,
    takeOnePressFromCurrentPlayer,
    applyBombGlobalEffect,
    resetPlayerGuessesAndGivePoints,
    assignWinner,
    assignMvps
  );

  // return assignMvps(
  //   assignWinner(
  //     resetPlayerGuessesAndGivePoints(
  //       takeOnePressFromCurrentPlayer(
  //         exploded
  //           ? explode(game, {
  //               playerId: game.currentPlayer.id,
  //               deathType: "balloon",
  //             })
  //           : game
  //       )
  //     )
  //   )
  // );
}

function explode(game: GasGame, killedBy: PlayerKilledBy | undefined): GasGame {
  const deadPlayerIds = [...game.deadPlayerIds, game.currentPlayer.id];
  const alivePlayersIds = game.alivePlayersIds.filter(
    (id) => id !== game.currentPlayer.id
  );
  const currentPlayer = getPlayerOrThrow(game, game.currentPlayer.id);

  const updatedCurrentPlayer: GasPlayer = {
    ...currentPlayer,
    status: "dead",
    killedBy,
    finishedPosition: game.allPlayers.length - (deadPlayerIds.length - 1),
    totalPresses: currentPlayer.totalPresses + 1,
    points: game.pointsMap[deadPlayerIds.length - 1]!,
  };

  return pipe(
    resetPlayerGuessesAndGivePoints({
      ...game,
      allPlayers: updatePlayerInList(game.allPlayers, updatedCurrentPlayer),
      alivePlayersIds,
      deadPlayerIds,
      currentPlayer: {
        ...game.currentPlayer,
        pressesRemaining: game.currentPlayer.pressesRemaining - 1,
      },
      gasCloud: {
        ...game.gasCloud,
        exploded: true,
      },
    }),
    assignWinner,
    assignMvps,
    setSuperGuessBonus,
    deactivateGlobalEffect
  );

  // return setSuperGuessBonus(
  //   assignMvps(
  //     assignWinner(
  //       resetPlayerGuessesAndGivePoints({
  //         ...game,
  //         allPlayers: updatePlayerInList(game.allPlayers, updatedCurrentPlayer),
  //         alivePlayersIds,
  //         deadPlayerIds,
  //         currentPlayer: {
  //           ...game.currentPlayer,
  //           pressesRemaining: game.currentPlayer.pressesRemaining - 1,
  //         },
  //         gasCloud: {
  //           ...game.gasCloud,
  //           exploded: true,
  //         },
  //       })
  //     )
  //   )
  // );
}

function takeOnePressFromCurrentPlayer(game: GasGame): GasGame {
  const currentPlayer = getPlayerOrThrow(game, game.currentPlayer.id);

  return {
    ...game,
    allPlayers: updatePlayerInList(game.allPlayers, {
      ...currentPlayer,
      totalPresses: currentPlayer.totalPresses + 1,
    }),
    currentPlayer: {
      ...game.currentPlayer,
      pressesRemaining: game.currentPlayer.pressesRemaining - 1,
    },
    gasCloud: {
      ...game.gasCloud,
      pressed: game.gasCloud.pressed + 1,
    },
  };
}

function applyBombGlobalEffect(game: GasGame): GasGame {
  if (game.alivePlayersIds.length <= 2) {
    return game;
  }

  const currentPlayer = getPlayerOrThrow(game, game.currentPlayer.id);

  if (
    game.currentPlayer.pressesRemaining === 0 &&
    game.currentPlayer.cardPlayed?.type === "bomb"
  ) {
    return {
      ...game,
      globalEffect: {
        playedByPlayerId: currentPlayer.player.id,
        type: "random-explode",
      },
    };
  }

  return game;
}

function resetPlayerGuessesAndGivePoints(game: GasGame): GasGame {
  if (!game.gasCloud.exploded) {
    return game;
  }

  const BONUS_POINTS = game.superGuessInEffect ? 3 : 1;

  return {
    ...game,
    allPlayers: game.allPlayers.map<GasPlayer>((p) => {
      const guessedCorrectly =
        p.guesses.nextPlayerOutGuess === game.currentPlayer.id;
      return {
        ...p,
        points: p.points + (guessedCorrectly ? BONUS_POINTS : 0),
        guesses: {
          nextPlayerOutGuess: undefined,
          nominatedCount: 0,
          correctGuessCount:
            p.guesses.correctGuessCount + (guessedCorrectly ? 1 : 0),
        },
      };
    }),
  };
}

function addCardToHistory(
  history: CardHistory[],
  playerId: string,
  card: GasCard
): CardHistory[] {
  return [{ playerId, cardPlayed: card }, ...history];
}

export function playCard(
  game: GasGame,
  playerId: string,
  cardIndex: number
): GasGame {
  if (playerId !== game.currentPlayer.id) {
    // throw `Player ${playerId} is not the current player ${game.currentPlayer.id}`;
    return game;
  }

  if (game.currentPlayer.pressesRemaining > 0) {
    // throw `Still ${game.currentPlayer.pressesRemaining} presses remaining`;
    return game;
  }

  const { player, card } = getPlayerAndCardOrThrow(game, playerId, cardIndex);

  const updatedCards = player.cards.filter((c, i) => i !== cardIndex);
  const updatedPlayer: GasPlayer = {
    ...player,
    curse: undefined, // Curse automatically removed after card is played
    cards: [
      ...updatedCards,
      createRandomCard(
        game.gameType,
        player.advantage,
        game.alivePlayersIds.length === 2
      ),
    ],
  };

  return {
    ...game,
    allPlayers: updatePlayerInList(game.allPlayers, updatedPlayer),
    currentPlayer: {
      ...game.currentPlayer,
      cardPlayed: card,
      pressesRemaining: applyEffectToCardPresses(
        card,
        game.globalEffect,
        playerId
      ),
    },
    direction:
      card.type === "reverse" ? getReverseDirection(game) : game.direction,
    moveHistory: addCardToHistory(game.moveHistory, playerId, card),
  };
}

export function explodePlayer(game: GasGame, playerId: string): GasGame {
  const updatedGame: GasGame = {
    ...game,
    currentPlayer: {
      id: playerId,
      pressesRemaining: 0,
    },
  };
  return explode(updatedGame, {
    playerId: game.currentPlayer.id,
    deathType: "bomb",
  });
}

function applyEffectToCardPresses(
  card: GasCard,
  effect: GlobalEffect | undefined,
  playerId: string
): number {
  if (!effect || effect.playedByPlayerId === playerId) {
    return card.presses;
  }

  switch (effect.type) {
    case "double": {
      return card.presses * 2;
    }
    default: {
      return card.presses;
    }
  }
}

export function playerTimedOut(game: GasGame, playerId: string): GasGame {
  if (game.currentPlayer.id !== playerId) {
    return game;
  }

  return explode(game, { playerId, deathType: "timeout" });
}

function updatePlayerInList(
  allPlayers: GasPlayer[],
  player: GasPlayer
): GasPlayer[] {
  return allPlayers.map((p) => (p.player.id === player.player.id ? player : p));
}

function getReverseDirection(game: GasGame): Direction {
  return game.direction === "left" ? "right" : "left";
}

function getPlayerOrThrow(game: GasGame, playerId: string): GasPlayer {
  const player = game.allPlayers.find((p) => p.player.id === playerId);
  if (!player) {
    throw `Player ${playerId} not found`;
  }

  return player;
}

function getPlayerAndCardOrThrow(
  game: GasGame,
  playerId: string,
  cardIndex: number
): { player: GasPlayer; card: GasCard } {
  const player = getPlayerOrThrow(game, playerId);

  const card = player.cards[cardIndex];
  if (!card) {
    throw `Card ${cardIndex} not found`;
  }

  return { player, card };
}

function createGasPlayer(player: Player, gameType: GasGameType): GasPlayer {
  const advantage = getPlayerAvailableCoins(player) > 0;
  return {
    player,
    status: "alive",
    advantage,
    cards: [
      createRandomCard(gameType, advantage),
      createRandomCard(gameType, advantage),
      createRandomCard(gameType, advantage),
    ],
    totalPresses: 0,
    points: 0,
    guesses: {
      correctGuessCount: 0,
      nominatedCount: 0,
    },
    pointsAllocation: {
      base: 0,
      correctGuesses: 0,
      mostCorrectGuesses: 0,
      mostPresses: 0,
    },
  };
}

function getRandomCardType(
  gameType: GasGameType,
  isFinalRound: boolean
): CardType {
  const cardWeights: WeightedItem<CardType>[] =
    gameType === "crazy"
      ? [
          { weight: 9, item: "bomb" },
          { weight: 2, item: isFinalRound ? "press" : "reverse" },
        ]
      : [
          { weight: 1, item: "skip" },
          { weight: 2, item: "bomb" },
          { weight: 4, item: "risky" },
          { weight: 4, item: "curse-all-fives" },
          { weight: 3, item: "reverse" },
          { weight: 14, item: "press" },
        ];

  if (gameType === "crazy") {
    return selectWeightedRandomOneOf(cardWeights);
  }

  return isFinalRound ? "press" : selectWeightedRandomOneOf(cardWeights);
}

function createCard(cardType: CardType, presses: number): GasCard {
  switch (cardType) {
    case "skip":
    case "reverse":
      return { type: cardType, presses: 0 };
    case "risky":
      return { type: "risky", presses: 4 };
    case "curse-all-fives":
      return { type: "curse-all-fives", presses: 6 };
    case "press":
      return { type: "press", presses };
    case "bomb":
      return { type: "bomb", presses: 8 };
  }
}

function createRandomCard(
  gameType: GasGameType,
  advantage: boolean,
  isFinalRound: boolean = false
): GasCard {
  const nextCardType = getRandomCardType(gameType, isFinalRound);
  const card = createCard(
    nextCardType,
    gameType === "crazy" || advantage ? 1 : selectRandomOneOf([1, 2, 3, 4, 5])
  );

  return card;
}
