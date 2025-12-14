import {
  chineseNewYearSounds,
  defaultSounds,
  weddingSounds,
  xmasSounds,
} from "../components/hooks/useSound/soundMap";
import { CnyJoinScreenDecoration } from "./chinese-new-year/JoinScreenDecoration";
import { JoinScreenDecoration } from "./default/JoinScreenDecoration";
import { GlobalGameTheme, ThemeTokens } from "./types";
import { XmasJoinScreenDecoration } from "./xmas/JoinScreenDecoration";

const DEFAULT_THEME: GlobalGameTheme = {
  tokens: {
    colours: {
      primaryText: "#FFFFFF",
      textAccent: "#FBA727",
      primaryBackground: "#8774FF",
      secondaryBackground: "#6757C7",
      buttonPrimaryBackground: "#6AE29A",
      buttonSecondaryBackground: "#7AFFE7",
      buttonPrimaryText: "#252525",
      buttonAccent: "rgb(0, 0, 0, 0.25)",
      ballonGame: {
        cardText: "#000000",
        cardAltText: "#E700B4",
        numberCardBackground: "#CBFFEF",
        skipCardBackground: "#FFD29D",
        cursedCardBackground: "#9ED38B",
        cursedCardVariantBackground: "#c17da8",
        bombCardBackground: "#F4576A",
        reverseCardBackground: "#FFD29D",
      },
    },
    fonts: {
      feature: "'Pixeboy', sans-serif",
      body: "'Raleway', sans-serif",
      numbers: "'Kameron', serif",
    },
  },
  sounds: defaultSounds,
  components: {
    JoinScreenDecoration: <JoinScreenDecoration />,
  },
};

const XMAS_THEME: GlobalGameTheme = {
  tokens: {
    ...DEFAULT_THEME.tokens,
    colours: {
      ...DEFAULT_THEME.tokens.colours,
      primaryText: "#FFFFFF",
      textAccent: "#ea4630",
      primaryBackground: "#165b33",
      secondaryBackground: "#0e3f22",
      buttonPrimaryBackground: "#6AE29A",
      buttonSecondaryBackground: "#7AFFE7",
    },
  },
  sounds: xmasSounds,
  components: {
    JoinScreenDecoration: <XmasJoinScreenDecoration />,
  },
};

const CNY_THEME: GlobalGameTheme = {
  tokens: {
    ...DEFAULT_THEME.tokens,
    colours: {
      ...DEFAULT_THEME.tokens.colours,
      primaryText: "#FFDE62",
      textAccent: "#ea4630",
      primaryBackground: "#E27676",
      secondaryBackground: "#AA381E",
      buttonPrimaryBackground: "#FFB200",
      buttonSecondaryBackground: "#FFF0D9",
    },
  },
  sounds: chineseNewYearSounds,
  components: {
    JoinScreenDecoration: <CnyJoinScreenDecoration />,
  },
};

const WEDDING_THEME: GlobalGameTheme = {
  tokens: {
    ...DEFAULT_THEME.tokens,
    colours: {
      ...DEFAULT_THEME.tokens.colours,
      primaryText: "#b57170",
      textAccent: "#ffb6c1",
      primaryBackground: "#FFE4E1",
      secondaryBackground: "#f5f5dc",
      buttonPrimaryBackground: "#b57170",
      buttonSecondaryBackground: "#FFF0D9",
    },
  },
  sounds: weddingSounds,
  components: {},
};

export default XMAS_THEME;
