import styled, { css, keyframes } from "styled-components";
import {
  MysteryBoxPlayer,
  MysteryBoxPlayerView,
} from "../../services/mystery-box/types";
import { AvatarSize, PlayerAvatar } from "../PlayerAvatar";
import { Attention } from "../animations/Attention";
import { ExplodingPlayer } from "../migrated/gas-out/ExplodingPlayer";
import { useDoOnce } from "../hooks/useDoOnce";

const Container = styled.div`
  position: relative;
`;

export const explodeAnimation = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  30% { transform: translate(0, -2000px) rotate(-1080deg); }
  100% { transform: translate(0, -2000px) rotate(-1080deg); }
`;

const ExplodingPlayerContainer = styled.div<{ exploded: boolean }>`
  /* display: flex;
  justify-content: center;
  width: 100%; */
  // visibility: ${({ exploded }) => (exploded ? "visible" : "hidden")};
  /* visibility: hidden; */
  /* opacity: ${({ exploded }) => (exploded ? "1" : "0.3")}; */
  ${({ exploded }) =>
    exploded &&
    css`
      animation: ${explodeAnimation} 2000ms ease-in-out 2s 1 both;
    `}
`;

type Props = {
  player: MysteryBoxPlayerView;
  status: "active" | "exploded" | "winner";
  explode: boolean;
  avatarSize: AvatarSize;
  showSelectedStatus: boolean;
};

export const MysteryBoxPlayerUi = ({
  player,
  status,
  explode,
  avatarSize,
  showSelectedStatus,
}: Props) => {
  return (
    <Container>
      <ExplodingPlayerContainer exploded={explode}>
        <Attention animate={status === "winner"} animation="pulse">
          <PlayerAvatar playerId={player.id} size={avatarSize} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              fontSize: "2rem",
            }}
          >
            {/* {player.status === "waiting" && <>⏳</>} */}
            {showSelectedStatus && player.status === "selected" && <>✅</>}
            {/* {player.status} {explode && <>💥</>} */}
          </div>
        </Attention>
      </ExplodingPlayerContainer>
    </Container>
  );
};
