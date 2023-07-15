import styled from "styled-components";
import { getWhosThatUrl } from "../utils/url";

const FancyLink = styled.a``;

export function LinkToMiniGame() {
  return (
    <FancyLink href={getWhosThatUrl("/pacman")}>To Minigame! 🍒</FancyLink>
  );
}
