import styled, { css, keyframes } from "styled-components";
import { MysteryBox } from "../../services/mystery-box/types";
import { SmallHeading } from "../Atoms";
import { useState } from "react";

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

const Box = styled.div`
  position: relative;
`;

const BoxBody = styled.div`
  position: relative;
  height: 100px;
  width: 100px;
  margin-top: 80px;
  background-color: #cc231e;
  border-bottom-left-radius: 5%;
  border-bottom-right-radius: 5%;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.3);
  background: linear-gradient(#762c2c, #ff0303);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    background: linear-gradient(#ffffff, #ffefa0);
  }
`;

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

  ${(props) =>
    props.isOpen &&
    css`
      opacity: 1;
      z-index: 1;
      transform: translate3d(-50%, 0, 0);
    `}
`;

const BoxLid = styled.div<{ isOpen: boolean }>`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50%;
  height: 40px;
  background-color: #cc231e;
  height: 20px;
  width: 110px;
  border-radius: 5%;
  box-shadow: 0 8px 4px -4px rgba(0, 0, 0, 0.3);

  ${(props) =>
    props.isOpen &&
    css`
      animation: ${BoxLidAnimation} 1s ease-in-out forwards;
    `}

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    background: linear-gradient(#ffefa0, #fff);
  }
`;

type Props = {
  box: MysteryBox;
};

type BoxState = "open" | "closed";

export const MysteryBoxUi = ({ box }: Props) => {
  const [boxState, setBoxState] = useState<BoxState>("closed");
  //codepen.io/RoyLee0702/pen/RwNgVya
  return (
    <Box onClick={() => setBoxState("open")}>
      <BoxBody />
      <BoxLid isOpen={boxState === "open"} />
      <BoxContents isOpen={boxState === "open"}>⭐️</BoxContents>
    </Box>
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
