import Link from "next/link";
import styled from "styled-components";
import { getPlayerHomeUrl } from "../utils/url";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: #f2d585;
  color: #b03461;
  /* overflow-x: hidden; */
`;

const Main = styled.div`
  /* border: 1px solid black; */
  width: 100vw;
  flex: 1;
  padding: 1rem;
`;

const Header = styled.div`
  flex-shrink: 0;
  /* border-bottom: 2px solid #05a9c7; */
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: #f7e6b6;
`;

const Footer = styled.div`
  flex-shrink: 0;
  /* border-top: 2px solid black; */
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: #f7e6b6;
`;

type Props = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  playerId: string;
};

export function PlayerPageLayout({
  children,
  headerContent,
  playerId,
}: Props): JSX.Element {
  return (
    <Container>
      {headerContent && <Header>{headerContent}</Header>}
      <Main>{children}</Main>
      <Footer>
        <Link href={getPlayerHomeUrl(playerId)}>Home</Link>
      </Footer>
    </Container>
  );
}
