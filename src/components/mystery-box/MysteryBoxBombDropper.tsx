import Image from "next/image";
import { useEffect, useReducer } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
  keyframes,
} from "styled-components";
import { generateRandomInt, selectRandomOneOf } from "../../utils/random";
import { Animation_ShakeBottom } from "../animations/Attention";
import { clampOrMin } from "../../utils/number";
import { useSound } from "../hooks/useSound";
import { SoundName } from "../hooks/useSound/types";
import bombImage from "./mystery-box-bomb.png";
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

type BombDropperState = "waiting" | "dropping";

type BoxDropperState = {
  boxPositions: BoxPosition[];
  currentFrame: BoxDropFrame;
  storyBoard: BoxDropStoryBoard;
  dropperState: BombDropperState;
};

type BoxDropStoryBoard = {
  currentFrameIndex: number;
  frames: BoxDropFrame[];
  finished: boolean;
};
type BoxFrameAction = "none" | "wobble" | "fake-drop" | "drop";
type BoxDropFrame = {
  boxIndex: number;
  action: BoxFrameAction;
  soundEffect?: SoundName;
};
type BoxDropperNextFrameAction = { type: "NEXT_FRAME" };
type BoxDropperStartDropperAction = { type: "START_DROPPER" };
type BoxDropperReturnToWaitingDropperAction = { type: "WAITING" };

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
  opacity: 0.7;
  top: -30%;
  left: -20%;
`;

const Dropper = styled.div<{
  animation: FlattenSimpleInterpolation | undefined;
}>`
  position: relative;
  z-index: 2;
  ${({ animation }) => animation}
  // filter: drop-shadow(-0 -10px 8px rgba(255, 141, 0, 0.9));
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
`;

type Props = {
  dropperState: BombDropperState;
  initialBoxIndex: number;
  bombBoxIndex: number;
  boxPositions: BoxPosition[];
  onBombDrop: () => void;
  totalSuspenseFrames: number;
};

export const MysteryBoxBombDropper = ({
  dropperState,
  initialBoxIndex,
  bombBoxIndex,
  boxPositions,
  onBombDrop,
  totalSuspenseFrames,
}: Props) => {
  const { play } = useSound();
  const [state, dispatch] = useReducer(bombDropperReducer, {
    storyBoard: createDropStoryBoard(
      boxPositions.length,
      bombBoxIndex,
      totalSuspenseFrames,
    ),
    boxPositions,
    dropperState,
    currentFrame: {
      boxIndex: initialBoxIndex,
      action: "none",
    },
  });

  useEffect(() => {
    if (state.currentFrame.soundEffect) {
      play(state.currentFrame.soundEffect);
    }
  }, [state.currentFrame, play]);

  useEffect(() => {
    if (dropperState === "dropping") {
      dispatch({ type: "START_DROPPER" });
    } else {
      dispatch({ type: "WAITING" });
    }
  }, [dropperState, play]);

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
        position={boxPositions[state.currentFrame.boxIndex]!}
        style={{
          transition: `left ${state.dropperState === "dropping" ? "0.8s" : "2s"} ease-in-out`,
        }}
      >
        <DropperPerson>
          <Image
            src={cinbyWaveImage}
            alt="Cinby waving"
            width={100}
            height={120}
          />
        </DropperPerson>
        <Dropper animation={ANIMATION_MAP[state.currentFrame.action]}>
          <Image src={bombImage} alt="Bomb" width={80} height={80} />
          {/* {state.dropperState} */}
        </Dropper>
      </PositionedBox>
    </Container>
  );
};

function bombDropperReducer(
  state: BoxDropperState,
  action:
    | BoxDropperNextFrameAction
    | BoxDropperStartDropperAction
    | BoxDropperReturnToWaitingDropperAction,
): BoxDropperState {
  switch (action.type) {
    case "NEXT_FRAME": {
      if (state.dropperState === "dropping") {
        const nextFrameIndex = state.storyBoard.currentFrameIndex + 1;
        const nextFrame = state.storyBoard.frames[nextFrameIndex];
        const finished = !nextFrame;
        return {
          ...state,
          currentFrame: nextFrame || state.currentFrame,
          storyBoard: {
            ...state.storyBoard,
            currentFrameIndex: nextFrameIndex,
            finished,
          },
        };
      } else {
        return {
          ...state,
          currentFrame: {
            boxIndex: clampOrMin(
              0,
              state.boxPositions.length - 1,
              state.currentFrame.boxIndex + 1,
            ),
            action: "none",
          },
        };
      }
    }
    case "START_DROPPER": {
      return {
        ...state,
        dropperState: "dropping",
      };
    }

    case "WAITING": {
      return {
        ...state,
        dropperState: "waiting",
        currentFrame: {
          boxIndex: state.currentFrame.boxIndex,
          action: "none",
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
  totalFrames: number,
): BoxDropStoryBoard {
  const frames: BoxDropFrame[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const boxIndex = generateRandomInt(0, numBoxes - 1);
    const action = selectRandomOneOf<BoxFrameAction>([
      "none",
      "wobble",
      "fake-drop",
    ]);

    frames.push({
      boxIndex,
      action,
      soundEffect: "mystery-box-bomb-dropper-move",
    });
  }

  frames.push({ boxIndex: bombBoxIndex, action: "drop" });

  return {
    currentFrameIndex: 0,
    frames,
    finished: false,
  };
}
