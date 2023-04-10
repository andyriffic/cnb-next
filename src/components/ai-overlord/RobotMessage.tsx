import styled from "styled-components";
import { useAiOverlord } from "../../providers/SocketIoProvider/useAiOverlord";
import { useSocketIo } from "../../providers/SocketIoProvider";

const Container = styled.div`
  background: red;
  border-radius: 1rem;
  border: 2px solid black;
  padding: 0.4rem;
  color: white;
`;

const Text = styled.p`
  font-size: 1rem;
  padding: 0.5rem;
`;

export const RobotMessage = () => {
  const { aiOverlord } = useSocketIo();

  return aiOverlord.lastRobotDebugMessage ? (
    <Container onDoubleClick={aiOverlord.clearRobotDebugMessage}>
      <Text>{aiOverlord.lastRobotDebugMessage}</Text>
    </Container>
  ) : null;
};
