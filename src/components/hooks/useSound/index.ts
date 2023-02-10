import { Howl } from "howler";
import { SoundName } from "./types";
import { SOUND_MAP } from "./soundMap";

type UseSound = {
  play: (soundName: SoundName) => void;
  loop: (soundName: SoundName) => void;
};

export const playSoundFromUrl = (url: string) => {
  const sound = new Howl({ src: url });
  sound.play();
};

const play = (soundName: SoundName) => {
  const sound = new Howl({ src: SOUND_MAP[soundName] });
  sound.play();
};

const loop = (soundName: SoundName): (() => void) => {
  const sound = new Howl({ src: SOUND_MAP[soundName], loop: true });
  sound.play();
  return () => {
    sound.stop();
  };
};

export const useSound = (): UseSound => {
  return {
    play,
    loop,
  };
};
