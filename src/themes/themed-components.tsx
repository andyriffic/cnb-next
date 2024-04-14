import { CnyJoinScreenDecoration } from "./chinese-new-year/JoinScreenDecoration";
import { JoinScreenDecoration } from "./default/JoinScreenDecoration";
import { ThemedComponents } from "./types";
import { XmasJoinScreenDecoration } from "./xmas/JoinScreenDecoration";

const DEFAULT_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <JoinScreenDecoration />,
};

const XMAS_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <XmasJoinScreenDecoration />,
};

const CNY_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <CnyJoinScreenDecoration />,
};

const BLANK_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <></>,
};

export default BLANK_COMPONENTS;
