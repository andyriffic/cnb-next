import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { DEFAULT_THEME, CORGI_THEME, FINVENGERS_THEME } from "../themes";
import { GlobalGameTheme } from "../themes/types";

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
  const { team } = useRouter().query;
  const currentTheme = useMemo(() => {
    switch (team) {
      case "Corgi":
        return CORGI_THEME;
      case "Finvengers":
        return FINVENGERS_THEME;
      default:
        return DEFAULT_THEME;
    }
  }, [team]);

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
