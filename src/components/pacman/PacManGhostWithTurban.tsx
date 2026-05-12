import React from "react";
import styled from "styled-components";
import { PacManGhost } from "./PacManGhost";

const Container = styled.div`
  position: relative;
`;

const Turban = styled.img`
  display: block;
  position: absolute;
  top: -30%;
  left: 15%;
  width: 70%;
`;

type Props = {
  color?: string;
  width?: number | string;
};

export const PacManGhostWithTurban = ({
  color = "#f00",
  width = 30,
}: Props) => {
  return (
    <Container>
      <Turban src="/images/pacman/turban.png" alt="santa hat" />
      <PacManGhost color={color} width={width} />
    </Container>
  );
};
