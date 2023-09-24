import Image from "next/image";
import { CSSProperties } from "react";
import styled, { css } from "styled-components";
import { getPlayerAvatarUrl } from "../utils/url";

export type FacingDirection = "right" | "left";
export type AvatarSize = "thumbnail" | "small" | "medium" | "large";

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

const ImagesSizeStyles: { [key in AvatarSize]: CSSProperties } = {
  thumbnail: { width: "8vh", height: "10vh" },
  small: { width: "14vh", height: "20vh" },
  medium: { width: "30vh", height: "40vh" },
  large: { width: "60vh", height: "80vh" },
};

type Props = {
  playerId: string;
  facing?: FacingDirection;
  size?: AvatarSize;
};

export const PlayerAvatar = ({
  playerId,
  facing = "right",
  size = "large",
}: Props): JSX.Element => {
  return (
    <>
      <ImageContainer reverseImage={facing === "left"}>
        <Image
          src={getPlayerAvatarUrl(playerId)}
          alt=""
          style={ImagesSizeStyles[size]}
          width={450}
          height={780}
        />
      </ImageContainer>
    </>
  );
};
