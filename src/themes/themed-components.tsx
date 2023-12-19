import { JoinScreenDecoration } from "./default/JoinScreenDecoration";
import { ThemedComponents } from "./types";
import { XmasJoinScreenDecoration } from "./xmas/JoinScreenDecoration";

const DEFAULT_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <JoinScreenDecoration />,
};

const XMAS_COMPONENTS: ThemedComponents = {
  JoinScreenDecoration: <XmasJoinScreenDecoration />,
};

export default XMAS_COMPONENTS;
