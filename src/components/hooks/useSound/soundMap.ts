import { SoundName } from "./types";

export const SOUND_MAP: { [key in SoundName]: string } = {
  "join-music": "/sounds/mojuo.mp3",
  "join-player-joined": "/sounds/sparkle.mp3",
  "rps-show-move": "/sounds/spinning_heart.mp3",
  "rps-new-round": "/sounds/bally_slot_win.mp3",
  "rps-spectator-chooses-option": "/sounds/ding.mp3",
  "rps-waiting-music": "/sounds/bally_slot_big_win.mp3",
  "rps-spectator-choice-reveal": "/sounds/bubble_pop.mp3",
};
