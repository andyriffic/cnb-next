import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
`;

const Main = styled.div`
  /* border: 1px solid black; */
  width: 100vw;
  flex: 1;
  max-height: 100vh;
  overflow: hidden;
`;

type Props = {
  children: React.ReactNode;
};

export function SpectatorPageLayout({ children }: Props): JSX.Element {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  );
}
