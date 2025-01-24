import styled from "styled-components";
import { CaptionText, Heading, SubHeading } from "../../Atoms";

const Container = styled.div`
  width: 50vw;
  text-align: right;
  font-size: 0.8rem;
`;

export function SuperguessPrompt(): JSX.Element {
  return (
    <Container>
      <SubHeading style={{ marginBottom: "0.3rem" }}>
        Superguess available!
      </SubHeading>
      <CaptionText style={{ marginBottom: "0.3rem" }}>
        All vote for the same player to get a bonus
      </CaptionText>
      <CaptionText>全部投票給同一位玩家即可獲得獎金</CaptionText>
    </Container>
  );
}
