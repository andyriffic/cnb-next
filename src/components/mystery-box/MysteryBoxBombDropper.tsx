import { on } from "events";
import Image from "next/image";
import { useEffect, useReducer } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
  keyframes,
} from "styled-components";
import { generateRandomInt, selectRandomOneOf } from "../../utils/random";
import { Animation_ShakeBottom } from "../animations/Attention";
import bombImage from "./bomb.png";
import cinbyWaveImage from "./cinby-wave.png";
import { BoxPosition, PositionedBox } from "./MysteryBoxCurrentRoundUi";

const fakeDropAnimation = keyframes`
 0% { transform: translate3d(0, 0, 0) }
 75% { transform: translate3d(0, 2vh, 0) }
 100% { transform: translate3d(0, 0, 0) }
`;

const realDropAnimation = keyframes`
 0% { transform: translate3d(0, 0, 0); opacity: 1; }
 100% { transform: translate3d(0, 4vh, 0); opacity: 0; }
`;

type BoxDropperState = {
  boxPositions: BoxPosition[];
  storyBoard: BoxDropStoryBoard;
};

type BoxDropStoryBoard = {
  currentFrameIndex: number;
  currentFrame: BoxDropFrame;
  frames: BoxDropFrame[];
  finished: boolean;
};
type BoxFrameAction = "none" | "wobble" | "fake-drop" | "drop";
type BoxDropFrame = {
  boxIndex: number;
  action: BoxFrameAction;
};
type BoxDropperAction = { type: "NEXT_FRAME" };

const ANIMATION_MAP: {
  [key in BoxFrameAction]: FlattenSimpleInterpolation | undefined;
} = {
  none: undefined,
  wobble: css`
    animation: ${Animation_ShakeBottom} 0.65s cubic-bezier(0.23, 1, 0.32, 1)
      700ms 1 both;
  `,
  "fake-drop": css`
    animation: ${fakeDropAnimation} 0.65s cubic-bezier(0.23, 1, 0.32, 1) 700ms 1
      both;
  `,
  drop: css`
    animation: ${realDropAnimation} 0.65s cubic-bezier(0.23, 1, 0.32, 1) 700ms 1
      both;
  `,
};

const Container = styled.div`
  position: relative;
`;

const DropperPerson = styled.div`
  position: absolute;
  top: -60%;
  left: -50%;
`;

const Dropper = styled.div<{
  animation: FlattenSimpleInterpolation | undefined;
}>`
  ${({ animation }) => animation}
`;

type Props = {
  bombBoxIndex: number;
  boxPositions: BoxPosition[];
  onBombDrop: () => void;
};

export const MysteryBoxBombDropper = ({
  bombBoxIndex,
  boxPositions,
  onBombDrop,
}: Props) => {
  const [state, dispatch] = useReducer(bombDropperReducer, {
    storyBoard: createDropStoryBoard(boxPositions.length, bombBoxIndex),
    boxPositions,
  });

  useEffect(() => {
    if (state.storyBoard.finished) {
      onBombDrop();
      return;
    }
    const interval = setInterval(() => {
      dispatch({
        type: "NEXT_FRAME",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onBombDrop, state.storyBoard.finished]);

  return (
    <Container>
      <PositionedBox
        position={boxPositions[state.storyBoard.currentFrame.boxIndex]!}
        style={{ transition: "left 0.5s ease-in-out" }}
      >
        {/* <DropperPerson>
          <Image
            src={cinbyWaveImage}
            alt="Cinby waving"
            width={100}
            height={120}
          />
        </DropperPerson> */}
        <Dropper
          animation={ANIMATION_MAP[state.storyBoard.currentFrame.action]}
        >
          <Image src={bombImage} alt="Bomb" width={80} height={100} />
        </Dropper>
      </PositionedBox>
    </Container>
  );
};

function bombDropperReducer(
  state: BoxDropperState,
  action: BoxDropperAction,
): BoxDropperState {
  switch (action.type) {
    case "NEXT_FRAME": {
      const nextFrameIndex = state.storyBoard.currentFrameIndex + 1;
      const nextFrame = state.storyBoard.frames[nextFrameIndex];
      const finished = !nextFrame;
      return {
        ...state,
        storyBoard: {
          ...state.storyBoard,
          currentFrameIndex: nextFrameIndex,
          currentFrame: nextFrame || state.storyBoard.currentFrame,
          finished,
        },
      };
    }
    default:
      return state;
  }
}

function createDropStoryBoard(
  numBoxes: number,
  bombBoxIndex: number,
): BoxDropStoryBoard {
  const totalFrames = 4;
  const frames: BoxDropFrame[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const boxIndex = generateRandomInt(0, numBoxes - 1);
    const action = selectRandomOneOf<BoxFrameAction>([
      "none",
      "wobble",
      "fake-drop",
    ]);

    frames.push({ boxIndex, action });
  }

  frames.push({ boxIndex: bombBoxIndex, action: "fake-drop" });

  return {
    currentFrameIndex: 0,
    currentFrame: frames[0]!,
    frames,
    finished: false,
  };
}
