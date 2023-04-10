import styled from "styled-components";
import { RPSMoveName } from "../../services/rock-paper-scissors/types";
import { getMoveEmoji } from "../rock-paper-scissors/ViewerPlayersMove";

const Container = styled.div`
  padding: 0.4rem;
`;

const Icon = styled.p`
  font-size: 5rem;
`;

type Props = {
  moveName: RPSMoveName;
};

export const AiMove = ({ moveName }: Props) => {
  return (
    <Container>
      <Icon>{getMoveEmoji(moveName)}</Icon>
    </Container>
  );
};
