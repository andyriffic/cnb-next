import { Howl } from "howler";
import { SoundName } from "./types";
import { SOUND_MAP } from "./soundMap";

type UseSound = {
  play: (soundName: SoundName) => void;
  loop: (soundName: SoundName) => Howl;
};

const play = (soundName: SoundName) => {
  const sound = new Howl({ src: SOUND_MAP[soundName], volume: 0.4 });
  sound.play();
};

const loop = (soundName: SoundName): Howl => {
  const sound = new Howl({
    src: SOUND_MAP[soundName],
    loop: true,
    volume: 0.2,
  });
  return sound;
};

export const useSound = (): UseSound => {
  return {
    play,
    loop,
  };
};
