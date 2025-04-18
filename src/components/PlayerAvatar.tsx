import { relative } from "path";
import Image from "next/image";
import { CSSProperties } from "react";
import styled, { css } from "styled-components";
import { getPlayerAvatarUrl } from "../utils/url";

export type FacingDirection = "right" | "left";
export type AvatarSize = "tiny" | "thumbnail" | "small" | "medium" | "large";

const ImageContainer = styled.div<{ reverseImage: boolean }>`
  /* width: 70vh; */
  /* height: 90vh; */
  display: block;
  ${({ reverseImage }) =>
    reverseImage &&
    css`
      transform: scaleX(-1);
    `}
`;

const IconContainer = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  top: 0;
  left: 15%;
`;

const ImagesSizeStyles: { [key in AvatarSize]: CSSProperties } = {
  tiny: { width: "4vh", height: "6vh" },
  thumbnail: { width: "8vh", height: "10vh" },
  small: { width: "14vh", height: "20vh" },
  medium: { width: "30vh", height: "40vh" },
  large: { width: "60vh", height: "80vh" },
};

type Props = {
  playerId: string;
  facing?: FacingDirection;
  size?: AvatarSize;
  hasAdvantage?: boolean;
};

export const PlayerAvatar = ({
  playerId,
  facing = "right",
  size = "large",
  hasAdvantage = false,
}: Props): JSX.Element => {
  return (
    <IconContainer>
      <ImageContainer reverseImage={facing === "left"}>
        <Image
          src={getPlayerAvatarUrl(playerId)}
          alt=""
          style={ImagesSizeStyles[size]}
          width={450}
          height={780}
        />
      </ImageContainer>
      {hasAdvantage && <Icon>✨</Icon>}
    </IconContainer>
  );
};
