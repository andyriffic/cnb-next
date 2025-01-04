import { Howl } from "howler";
import THEME from "../../../themes";
import { SoundName } from "./types";

type UseSound = {
  play: (soundName: SoundName) => Howl;
  loop: (soundName: SoundName) => Howl;
};

const play = (soundName: SoundName): Howl => {
  const sound = new Howl({ src: THEME.sounds[soundName], volume: 0.2 });
  sound.play();
  return sound;
};

const loop = (soundName: SoundName): Howl => {
  const sound = new Howl({
    src: THEME.sounds[soundName],
    loop: true,
    volume: 0.1,
  });
  return sound;
};

export const useSound = (): UseSound => {
  return {
    play,
    loop,
  };
};
