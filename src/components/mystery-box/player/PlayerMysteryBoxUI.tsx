import styled, { css, keyframes } from "styled-components";
import tinycolor from "tinycolor2";
import { MysteryBox } from "../../../services/mystery-box/types";

const Box = styled.div`
  position: relative;
  height: 100px;
`;

const BoxBody = styled.div<{ primaryColor: string }>`
  position: relative;
  height: 100px;
  width: 100px;
  margin-top: 80px;
  background-color: ${({ primaryColor }) => primaryColor};
  border-bottom-left-radius: 5%;
  border-bottom-right-radius: 5%;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.3);
  background: linear-gradient(
    ${({ primaryColor }) => tinycolor(primaryColor).darken(20).toHexString()},
    ${({ primaryColor }) => primaryColor}
  );

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

const BoxLid = styled.div<{ primaryColor: string }>`
  position: absolute;
  z-index: 1;
  left: 50px;
  bottom: 15px;
  transform: translateX(-50%);
  height: 40px;
  background-color: ${({ primaryColor }) => primaryColor};
  height: 20px;
  width: 110px;
  border-radius: 5%;
  box-shadow: 0 8px 4px -4px rgba(0, 0, 0, 0.3);

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
  selected: boolean;
  dim: boolean;
};

type BoxState = "open" | "closed";

// const BOX_CONTENTS: Record<MysteryBoxContentsType, JSX.Element> = {
//   coin: <Coins totalCoins={1} />,
//   points: <></>,
//   empty: <>🙈</>,
//   bomb: <>💣</>,
// };

export const BOX_COLORS: Record<number, string> = {
  0: "#cc231e",
  1: "#0d6efd",
  2: "#198754",
  3: "#ffc107",
};

export const PlayerMysteryBoxUi = ({ box, selected, dim = false }: Props) => {
  // const [boxState, setBoxState] = useState<BoxState>("closed");
  const boxColorHex = BOX_COLORS[box.id] || "#000";

  // useEffect(() => {
  //   if (onReveal) {
  //     setTimeout(() => {
  //       onReveal();
  //     }, 3000);
  //   }
  // }, [onReveal, open]);

  //codepen.io/RoyLee0702/pen/RwNgVya
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: boxColorHex,
        fontSize: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: dim ? 0.5 : 1,
        borderRadius: "1rem",
      }}
    >
      {selected && <>🤞</>}
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
