import styled from "styled-components";
import Link from "next/link";
import { getWhosThatUrl, urlWithTeamQueryParam } from "../utils/url";

const FancyLink = styled(Link)``;

type Props = {
  team?: string;
};

export function LinkToMiniGame({ team }: Props) {
  return (
    <FancyLink
      href={urlWithTeamQueryParam(
        getWhosThatUrl(urlWithTeamQueryParam("/pacman", team)),
        team,
      )}
    >
      To Minigame! 🚀
    </FancyLink>
  );
}
