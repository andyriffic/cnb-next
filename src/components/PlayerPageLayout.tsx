import Link from "next/link";
import styled from "styled-components";
import { getClassicCnbPlayerUrl, getPlayerHomeUrl } from "../utils/url";
import THEME from "../themes/types";
import { PlayerQuestionDialog } from "./player/PlayerQuestionDialog";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* width: 100vw; */
  justify-content: center;
  align-items: center;
  background-color: ${THEME.colours.primaryBackground};
  color: ${THEME.colours.primaryText};
  /* overflow-y: scroll; */
`;

const Main = styled.div`
  /* border: 1px solid black; */
  width: 100vw;
  flex: 1 1;
  padding: 1rem;
`;

const Header = styled.div`
  flex-shrink: 0;
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: ${THEME.colours.secondaryBackground};
`;

const Footer = styled.div`
  flex-shrink: 0;
  /* border-top: 2px solid black; */
  min-height: 20px;
  width: 100vw;
  padding: 1rem;
  background-color: ${THEME.colours.secondaryBackground};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
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
        <FooterContent>
          <Link href={getPlayerHomeUrl(playerId)}>Home</Link>
        </FooterContent>
      </Footer>
      <PlayerQuestionDialog playerId={playerId} />
    </Container>
  );
}
