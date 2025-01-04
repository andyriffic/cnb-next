import { SoundName } from "../components/hooks/useSound/types";

export type ThemeTokens = {
  colours: {
    primaryText: string;
    textAccent: string;
    primaryBackground: string;
    secondaryBackground: string;
    buttonPrimaryBackground: string;
    buttonSecondaryBackground: string;
    buttonPrimaryText: string;
    buttonAccent: string;
    ballonGame: {
      cardText: string;
      cardAltText: string;
      numberCardBackground: string;
      skipCardBackground: string;
      cursedCardBackground: string;
      bombCardBackground: string;
      reverseCardBackground: string;
    };
  };
  fonts: {
    feature: string;
    body: string;
    numbers: string;
  };
};

export type ThemedComponents = {
  JoinScreenDecoration?: JSX.Element;
};

export type GlobalGameTheme = {
  sounds: { [key in SoundName]: string };
  tokens: ThemeTokens;
  components: ThemedComponents;
};
