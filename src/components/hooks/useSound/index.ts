import { Howl } from "howler";
import { useCallback } from "react";
import THEME from "../../../themes";
import { useUiTheme } from "../../../providers/UiThemeProvider";
import { GlobalGameTheme } from "../../../themes/types";
import { SoundName } from "./types";

type UseSound = {
  play: (soundName: SoundName) => Howl;
  loop: (soundName: SoundName) => Howl;
};

const play = (soundName: SoundName, theme: GlobalGameTheme): Howl => {
  const sound = new Howl({ src: theme.sounds[soundName], volume: 0.2 });
  sound.play();
  return sound;
};

const loop = (soundName: SoundName, theme: GlobalGameTheme): Howl => {
  const sound = new Howl({
    src: theme.sounds[soundName],
    loop: true,
    volume: 0.1,
  });
  return sound;
};

export const useSound = (theme: GlobalGameTheme = THEME): UseSound => {
  const playWithTheme = useCallback(
    (soundName: SoundName) => play(soundName, theme),
    [theme],
  );

  const loopWithTheme = useCallback(
    (soundName: SoundName) => loop(soundName, theme),
    [theme],
  );

  return {
    play: playWithTheme,
    loop: loopWithTheme,
  };
};
