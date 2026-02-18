import { SpaceRacePlayer } from "./types";

type Props = {
  player: SpaceRacePlayer;
};

export const CnyHorse = ({ player }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      width="120"
      height="120"
    >
      <g id="horse">
        <path
          d="M260 250
         C260 160, 420 130, 560 160
         C700 190, 760 240, 740 290
         C720 340, 620 360, 500 350
         C380 340, 260 310, 260 250 Z"
          fill="#8B5A2B"
        />

        <path
          d="M360 230
         C430 200, 520 200, 600 230"
          stroke="#9C6A3A"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
        />

        <path
          d="M560 160
         C620 90, 700 90, 740 150
         C710 165, 670 190, 620 215
         C590 230, 560 210, 560 160 Z"
          fill="#8B5A2B"
        />

        <path
          d="M575 155
         C640 110, 710 120, 760 165
         L760 185
         C700 160, 640 165, 590 195 Z"
          fill="#6E441F"
        />

        <path
          d="M740 150
         C800 140, 860 165, 860 195
         C860 225, 810 245, 760 230
         C740 225, 730 180, 740 150 Z"
          fill="#8B5A2B"
        />

        <ellipse cx="855" cy="205" rx="26" ry="20" fill="#6E441F" />

        <circle cx="815" cy="175" r="6" fill="#1A1A1A" />

        <path d="M760 115 L780 60 L800 120 Z" fill="#8B5A2B" />

        <path
          d="M260 260
         C180 300, 160 360, 190 430"
          stroke="#6E441F"
          stroke-width="30"
          stroke-linecap="round"
          fill="none"
        />

        <path
          d="M640 320
         C700 360, 780 380, 840 360"
          stroke="#8B5A2B"
          stroke-width="36"
          stroke-linecap="round"
          fill="none"
        />

        <rect x="820" y="350" width="45" height="24" rx="6" fill="#3A2A1A" />

        <path
          d="M420 330
         C380 400, 360 430, 330 450"
          stroke="#8B5A2B"
          stroke-width="36"
          stroke-linecap="round"
          fill="none"
        />

        <rect x="310" y="440" width="45" height="24" rx="6" fill="#3A2A1A" />

        <path
          d="M580 330
         C620 380, 660 410, 720 420"
          stroke="#7A4E24"
          stroke-width="28"
          stroke-linecap="round"
          fill="none"
          opacity="0.9"
        />

        <path
          d="M360 330
         C330 380, 310 410, 290 430"
          stroke="#7A4E24"
          stroke-width="28"
          stroke-linecap="round"
          fill="none"
          opacity="0.9"
        />
      </g>

      <g id="saddle">
        <path
          id="saddle-base"
          d="M430 190
         C470 165, 580 165, 620 195
         L620 245
         C580 270, 470 270, 430 245 Z"
          fill={player.color}
        />

        <path
          d="M440 205
         C480 185, 570 185, 610 205"
          stroke={player.color}
          stroke-width="6"
          fill="none"
        />

        <rect
          id="name-plate"
          x="480"
          y="215"
          width="130"
          height="44"
          rx="16"
          fill="#F5F5F5"
        />
      </g>
    </svg>
  );
};
