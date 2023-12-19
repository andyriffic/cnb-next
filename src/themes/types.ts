type ThemeTokens = {
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

const DEFAULT_THEME: ThemeTokens = {
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
      bombCardBackground: "#F4576A",
      reverseCardBackground: "#FFD29D",
    },
  },
  fonts: {
    feature: "'Pixeboy', sans-serif",
    body: "'Raleway', sans-serif",
    numbers: "'Kameron', serif",
  },
};

const XMAS_THEME: ThemeTokens = {
  ...DEFAULT_THEME,
  colours: {
    ...DEFAULT_THEME.colours,
    primaryText: "#FFFFFF",
    textAccent: "#ea4630",
    primaryBackground: "#165b33",
    secondaryBackground: "#0e3f22",
    buttonPrimaryBackground: "#6AE29A",
    buttonSecondaryBackground: "#7AFFE7",
    ballonGame: {
      ...DEFAULT_THEME.colours.ballonGame,
    },
  },
};

export default XMAS_THEME;
