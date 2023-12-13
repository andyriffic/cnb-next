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
  };
  fonts: {
    feature: string;
    body: string;
    numbers: string;
  };
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
  },
  fonts: {
    feature: "'Press Start 2P'",
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
    secondaryBackground: "#6757C7",
    buttonPrimaryBackground: "#6AE29A",
    buttonSecondaryBackground: "#7AFFE7",
  },
};

export default XMAS_THEME;
