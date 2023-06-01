import { useState } from "react";
import styled from "styled-components";

const Container = styled.div<{ scrollable: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: ${({ scrollable }) => (scrollable ? "visible" : "hidden")};
  justify-content: center;
  align-items: center;
  background-color: #f2d585;
  color: #b03461;
`;

const Main = styled.div<{ scrollable: boolean }>`
  /* border: 1px solid black; */
  width: 100vw;
  flex: 1;
  /* min-height: 100vh; */
  overflow: ${({ scrollable }) => (scrollable ? "visible" : "hidden")};
`;

const DebugContainer = styled.div`
  flex-shrink: 0;
  border-top: 2px solid #b03461;
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: #f7e6b6;
  overflow: hidden;
`;

const SuperSecretDebugToggle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
`;

type Props = {
  children: React.ReactNode;
  debug?: React.ReactNode;
  scrollable?: boolean;
};

export function SpectatorPageLayout({
  children,
  debug,
  scrollable = false,
}: Props): JSX.Element {
  const [showDebug, setShowDebug] = useState(false);
  return (
    <Container scrollable={scrollable}>
      <Main scrollable={scrollable}>{children}</Main>
      <SuperSecretDebugToggle onClick={() => setShowDebug(!showDebug)} />
      {showDebug && debug && (
        <DebugContainer style={{ zIndex: 1, border: "1px solid white" }}>
          {debug}
        </DebugContainer>
      )}
    </Container>
  );
}
