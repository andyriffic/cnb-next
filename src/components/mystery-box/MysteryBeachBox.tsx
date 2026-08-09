import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import tinycolor from "tinycolor2";
import Image, { StaticImageData } from "next/image";
import {
  MysteryBox,
  MysteryBoxContents,
  MysteryBoxContentsType,
} from "../../services/mystery-box/types";
import { Coins } from "../Coins";
import THEME from "../../themes";
import bombImage from "./mystery-box-bomb.png";
import beachImage from "./beach-box.png";
import beachImage01 from "./beach-box-01.png";
import beachImage02 from "./beach-box-02.png";
import beachImage03 from "./beach-box-03.png";
import beachImage04 from "./beach-box-04.png";

const BoxLidAnimation = keyframes`
0%,
  42% {
            transform: translate3d(-50%, 0%, 0) rotate(0deg);
  }
  60% {
            transform: translate3d(-85%, -230%, 0) rotate(-25deg);
  }
  90%, 100% {
            transform: translate3d(-119%, 225%, 0) rotate(-70deg);
  }
`;

const RevealBoxContents = keyframes`
0%{
            transform: translate3d(-50%, 110%, 0);
            opacity: 0;
  }
  100% {
            transform: translate3d(-50%, 0, 0);
            opacity: 1;
  }
`;

const Points = styled.div`
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 3vw;
  height: 3vw;
  background: darkblue;
  color: ${THEME.tokens.colours.primaryText};
  border-radius: 50%;
  border: 0.2rem solid ${THEME.tokens.colours.secondaryBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: ${THEME.tokens.fonts.numbers};
  font-weight: bold;
`;

const HigherPoints = styled(Points)`
  background-color: darkgreen;
`;

const BoxName = styled.div<{ primaryColor: string }>`
  border: 8px solid ${({ primaryColor }) => primaryColor};
  border-top: none;
  border-radius: 0 0 1rem 1rem;
  background-color: white;
  color: black;
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
  font-size: 0.8rem;
  // text-transform: uppercase;
`;

const Box = styled.div<{ primaryColor: string; image: StaticImageData }>`
  border-radius: 1rem 1rem 0 0;
  border-width: 4px;
  border-style: solid;
  border-color: ${({ primaryColor }) => primaryColor};
  overflow: hidden;
  padding: 0;
  position: relative;
  width: 150px;
  height: 150px;
  background: url(${(props) => props.image.src}) no-repeat center center;
  background-size: cover;
  background-color: ${({ primaryColor }) => primaryColor};
`;

const BoxImageContainer = styled.div``;

const BoxContents = styled.div<{ isOpen: boolean }>`
  transition: all 500ms ease-in-out 2s;
  opacity: 0;
  z-index: 2;
  transform: translate3d(-50%, 110%, 0);
  display: block;
  font-size: 4rem;
  // width: 100px;
  text-align: center;

  position: absolute;
  left: 50%;
  top: 0;

  animation: ${RevealBoxContents} 1s ease-in-out forwards;
`;

type Props = {
  box: MysteryBox;
  open: boolean;
  onReveal?: () => void;
};

type BoxState = "open" | "closed";

export const BOX_COLORS: Record<number, string> = {
  0: "#cc231e",
  1: "#0d6efd",
  2: "#198754",
  3: "#ffc107",
};

const EXTRA_BOX_CONFIG: Record<
  number,
  { name: string; image: StaticImageData }
> = {
  0: { name: "Broker Beach", image: beachImage01 },
  1: { name: "Equity Bay", image: beachImage02 },
  2: { name: "Turtle Cove", image: beachImage03 },
  3: { name: "Interest Island", image: beachImage04 },
};

export const getBoxContents = (
  boxContents: MysteryBoxContents,
): JSX.Element => {
  switch (boxContents.type) {
    case "coin":
      return <Coins totalCoins={boxContents.value} />;
    case "points":
      if (boxContents.value > 1) {
        return <HigherPoints>+{boxContents.value}</HigherPoints>;
      } else {
        return <Points>+{boxContents.value}</Points>;
      }
    case "empty":
      return <></>;
    case "bomb":
      return <Image src={bombImage} alt="Bomb" width={120} height={120} />;
    default:
      return <></>;
  }
};

export const MysteryBeachBox = ({ box, onReveal, open }: Props) => {
  // const [boxState, setBoxState] = useState<BoxState>("closed");
  const boxColorHex = BOX_COLORS[box.id] || "#000";
  const boxConfig = EXTRA_BOX_CONFIG[box.id] || {
    name: "Unknown Beach",
    image: beachImage01,
  };

  // useEffect(() => {
  //   if (onReveal) {
  //     setTimeout(() => {
  //       onReveal();
  //     }, 3000);
  //   }
  // }, [onReveal, open]);

  //codepen.io/RoyLee0702/pen/RwNgVya
  return (
    <div>
      <Box primaryColor={boxColorHex} image={boxConfig.image}>
        {open && (
          <BoxContents isOpen={open}>
            {getBoxContents(box.contents)}
          </BoxContents>
        )}
        {/* <Image
        src={beachImage}
        alt="Beach Box"
        width={200}
        height={200}
        style={{
          display: "block",
          border: "5px solid #ccc",
          borderRadius: "2rem",
          padding: "0",
          margin: "0",
        }}
      /> */}
      </Box>
      {boxConfig.name && (
        <BoxName primaryColor={boxColorHex}>{boxConfig.name}</BoxName>
      )}
    </div>
    // <div style={{ display: "flex", gap: "0.5rem" }}>
    //   <SmallHeading style={{ textAlign: "center" }}>
    //     {box.id} : {box.contents.type} - {box.contents.value}
    //   </SmallHeading>
    //   <div style={{ display: "flex", gap: "0.5rem" }}>
    //     {box.playerIds.map((pid) => (
    //       <p key={pid}>{pid}</p>
    //     ))}
    //   </div>
    // </div>
  );
};
