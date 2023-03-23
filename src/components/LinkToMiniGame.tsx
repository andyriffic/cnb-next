import styled from "styled-components";
import { getWhosThatUrl } from "../utils/url";

const FancyLink = styled.a``;

export function LinkToMiniGame() {
  return (
    <FancyLink href={getWhosThatUrl("http://cnb.finx-rocks.com/donkey-kong")}>
      To Minigame! 🍒
    </FancyLink>
  );
}
