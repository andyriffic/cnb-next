import { Howl } from "howler";
import { SoundName } from "./types";
import { SOUND_MAP } from "./soundMap";

type UseSound = {
  play: (soundName: SoundName) => void;
  loop: (soundName: SoundName) => Howl;
};

export const playSoundFromUrl = (url: string) => {
  const sound = new Howl({ src: url });
  sound.play();
};

const play = (soundName: SoundName) => {
  const sound = new Howl({ src: SOUND_MAP[soundName] });
  sound.play();
};

const loop = (soundName: SoundName): Howl => {
  const sound = new Howl({
    src: SOUND_MAP[soundName],
    loop: true,
    volume: 0.5,
  });
  return sound;
};

export const useSound = (): UseSound => {
  return {
    play,
    loop,
  };
};
