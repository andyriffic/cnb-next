import React, { useCallback, useMemo, useState } from "react";
import DEFAULT_THEME from "../themes";
import { GlobalGameTheme } from "../themes/types";

type PlayerNames = { [playerId: string]: string };

type UiThemeService = {
  theme: GlobalGameTheme;
};

type Props = {
  children: React.ReactNode;
};

const UiThemeContext = React.createContext<UiThemeService | undefined>(
  undefined,
);

export const UiThemeProvider = ({ children }: Props): JSX.Element => {
  const [currentTheme] = useState<GlobalGameTheme>(DEFAULT_THEME);

  return (
    <UiThemeContext.Provider
      value={{
        theme: currentTheme,
      }}
    >
      {children}
    </UiThemeContext.Provider>
  );
};

export function useUiTheme(): UiThemeService {
  const context = React.useContext(UiThemeContext);
  if (context === undefined) {
    throw new Error("useUiTheme must be used within a UiThemeProvider");
  }
  return context;
}
