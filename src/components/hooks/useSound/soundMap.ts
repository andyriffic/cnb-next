import { SoundName } from "./types";

export const SOUND_MAP: { [key in SoundName]: string } = {
  "join-music": "/sounds/mojuo.mp3",
  "join-player-joined": "/sounds/dbz_instant_trans.mp3",
  "rps-show-move": "/sounds/spinning_heart.mp3",
  "rps-result-win": "/sounds/winner.mp3",
  "rps-result-draw": "/sounds/crowd_oooo.mp3",
  "rps-new-round": "/sounds/soft_sound.mp3",
  "rps-game-on": "/sounds/bally_slot_win.mp3",
  "rps-front-runners": "/sounds/sparkle.mp3",
  "rps-could-win-next-round": "/sounds/dun_dun_dun.mp3",
  "rps-definite-winner": "/sounds/second_fanfare.mp3",
  "rps-spectator-chooses-option": "/sounds/bubble_pop.mp3",
  "rps-waiting-music": "/sounds/bally_slot_big_win.mp3",
  "rps-spectator-choice-reveal": "/sounds/bubble_pop.mp3",
  "rps-award-winner": "/sounds/nfl.mp3",
  "rps-award-loser": "/sounds/wah_wah_wah.mp3",
  "rps-award-middle": "/sounds/meh.mp3",
};
