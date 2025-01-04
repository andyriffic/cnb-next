import styled from "styled-components";
import { useState } from "react";
import { Card, SmallHeading } from "../Atoms";
import THEME from "../../themes";
import {
  MIN_PACMAN_MOVES,
  PacManUiState,
  getJailedPlayers,
  sumPlayerMoves,
} from "./hooks/usePacman/reducer";
import { PacMan } from "./PacMan";

const Container = styled.div``;

const MathsSymbol = styled.div`
  color: white;
  font-size: 3rem;
`;

const Moves = styled.div`
  padding: 0.1rem;
  background: black;
  border-radius: 50%;
  border: 2px solid black;
  color: yellow;
  font-family: ${THEME.tokens.fonts.numbers};
  font-size: 1.2rem;
  display: inline-block;
`;

type Props = {
  uiState: PacManUiState;
};

export function PacmanMovesInfo({ uiState }: Props): JSX.Element {
  const [jailedPlayers] = useState(getJailedPlayers(uiState.allPacPlayers));
  const [totalJailedMoves] = useState(sumPlayerMoves(jailedPlayers));
  return (
    <Container>
      <Card>
        <SmallHeading centered={true} style={{ paddingBottom: "1rem" }}>
          Pacman moves
        </SmallHeading>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div>
            <PacMan state={uiState} />
            <Moves style={{ marginTop: "1rem" }}>{MIN_PACMAN_MOVES}</Moves>
          </div>
          <MathsSymbol>+</MathsSymbol>
          <div>
            <div>
              {jailedPlayers.map((player) => {
                return <div key={player.player.id}>{player.player.name}</div>;
              })}
            </div>
            <Moves style={{ marginTop: "1rem" }}>{totalJailedMoves}</Moves>
          </div>
          <MathsSymbol>=</MathsSymbol>
          <div>
            <Moves style={{ fontSize: "2rem" }}>
              {MIN_PACMAN_MOVES + totalJailedMoves}
            </Moves>
          </div>
        </div>
      </Card>
    </Container>
  );
}
