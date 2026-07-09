import styled from "styled-components";
import Link from "next/link";
import { getWhosThatUrl, urlWithTeamQueryParam } from "../utils/url";

const FancyLink = styled(Link)``;

type Props = {
  team?: string;
};

export function LinkToMiniGame({ team }: Props) {
  return (
    <FancyLink href={urlWithTeamQueryParam(getWhosThatUrl("/pacman"), team)}>
      To Minigame! 🚀
    </FancyLink>
  );
}
