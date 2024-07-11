import { SoundName } from "./types";

const DEFAULT_SOUND_MAP: { [key in SoundName]: string } = {
  "join-music": "/sounds/music/tmnt3_stage_8.mp3",
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
  "whos-that": "/sounds/whos-that-pokemon.mp3",
  "ai-thinking": "/sounds/processing.mp3",
  "ai-speaking": "/sounds/robot_beeps.mp3",
  "ai-typing": "/sounds/keyboard_typing.mp3",
  "gas-play-number-card": "/sounds/fast_gesture.mp3",
  "gas-play-reverse-card": "/sounds/cartoon_skittle.mp3",
  "gas-play-skip-card": "/sounds/wuuhee_cute.mp3",
  "gas-play-risky-card": "/sounds/fall_scream.mp3",
  "gas-play-survived-risk": "/sounds/phew.mp3",
  "gas-cursed": "/sounds/mission_failed.mp3",
  "gas-boomerang": "/sounds/smack_aaa_oh.mp3",
  "gas-inflate": "/sounds/air_inflate.mp3",
  "gas-explode": "/sounds/balloon_pop_sound_loud.mp3",
  "gas-player-die": "/sounds/wilhelm_scream.mp3",
  "gas-winner": "/sounds/fanfare.mp3",
  "gas-head-to-head-round": "/sounds/power_mode.mp3",
  "gas-background-music": "/sounds/music/brawl_arcade.mp3",
  "gas-super-guess": "/sounds/wow.mp3",
  "pacman-eat-player": "/sounds/pacman_ghost.mp3",
  "pacman-move-pacman": "/sounds/pacman_move.mp3",
  "pacman-move-player": "/sounds/pacman_fruit.mp3",
  "pacman-pill-safe": "/sounds/wuuhee_cute.mp3",
  "zombie-run-players-running": "/sounds/screaming.mp3",
  "zombie-run-zombie-moving": "/sounds/minecraft_zombie_2.mp3",
  "zombie-run-player-zombie-moving": "/sounds/zombie_groan.mp3",
  "zombie-run-player-bitten": "/sounds/eating_minecraft.mp3",
  "zombie-run-party": "/sounds/thriller_long_intro.mp3",
  "zombie-run-banana": "/sounds/default/slide_whistle.mp3",
  "number-crunch-guessing-music": "/sounds/music/tmnt_sewers.mp3",
  "number-crunch-player-guessed": "/sounds/bubble_pop.mp3",
  "number-crunch-reveal-guess": "/sounds/default/final_jeopardy.mp3",
  "number-crunch-player-gusssed-number": "/sounds/power_mode.mp3",
  "number-crunch-player-guessed-close": "/sounds/crowd_oooo.mp3",
  "number-crunch-player-guessed-far": "/sounds/default/price_is_right_fail.mp3",
  "number-crunch-final-show-winner": "/sounds/nfl.mp3",
  "number-crunch-final-show-rest": "/sounds/meh.mp3",
};

const XMAS_SOUND_MAP: { [key in SoundName]: string } = {
  ...DEFAULT_SOUND_MAP,
  "join-music": "/sounds/xmas/jingle_bells.mp3",
  "join-player-joined": "/sounds/xmas/santa_ho_ho_ho_ho_ho.mp3",
  "gas-background-music": "/sounds/xmas/jingle_bells_2.mp3",
  "rps-waiting-music": "/sounds/xmas/jingle_bells_2.mp3",
  "rps-new-round": "/sounds/xmas/santa_ho_ho_ho_ho_ho.mp3",
  "rps-game-on": "/sounds/xmas/santa_ho_ho_ho_ho_ho.mp3",
  "rps-spectator-choice-reveal": "/sounds/xmas/sleigh_bell.mp3",
};

const CNY_SOUND_MAP: { [key in SoundName]: string } = {
  ...DEFAULT_SOUND_MAP,
  "join-music": "/sounds/chinese-new-year/cny_138.mp3",
  "join-player-joined": "/sounds/chinese-new-year/guzheng.mp3",
  "gas-background-music": "/sounds/chinese-new-year/god_of_wealth.mp3",
  "number-crunch-guessing-music":
    "/sounds/chinese-new-year/db_instrumental.mp3",
};

const WEDDING_SOUND_MAP: { [key in SoundName]: string } = {
  ...DEFAULT_SOUND_MAP,
  "join-music": "/sounds/music/arcade.mp3",
};

export const SOUND_MAP = {
  ...DEFAULT_SOUND_MAP,
};
