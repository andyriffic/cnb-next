import styled from "styled-components";
import Link from "next/link";
import { getWhosThatUrl } from "../utils/url";

const FancyLink = styled(Link)``;

export function LinkToMiniGame() {
  return (
    <FancyLink href={getWhosThatUrl("/space-race")}>To Minigame! 🚀</FancyLink>
  );
}
