import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #f2d585;
  color: #b03461;
`;

const Main = styled.div`
  /* border: 1px solid black; */
  width: 100vw;
  flex: 1;
  /* min-height: 100vh; */
  overflow: scroll;
`;

const DebugContainer = styled.div`
  flex-shrink: 0;
  border-top: 2px solid #b03461;
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: #f7e6b6;
  overflow: scroll;
`;

type Props = {
  children: React.ReactNode;
  debug?: React.ReactNode;
};

export function SpectatorPageLayout({ children, debug }: Props): JSX.Element {
  return (
    <Container>
      <Main>{children}</Main>
      {debug && <DebugContainer>{debug}</DebugContainer>}
    </Container>
  );
}
