import styled from "styled-components";
import Link from "next/link";
import { getWhosThatUrl, urlWithTeamQueryParam } from "../utils/url";

const FancyLink = styled(Link)``;

type Props = {
  team?: string;
};

export function LinkToMiniGame({ team }: Props) {
  const miniGameUrl = team?.toLowerCase() === "corgi" ? "/dog-park" : "/pacman";

  return (
    <FancyLink
      href={urlWithTeamQueryParam(
        getWhosThatUrl(urlWithTeamQueryParam(miniGameUrl, team)),
        team,
      )}
    >
      To Minigame! 🚀
    </FancyLink>
  );
}
