import { type JSX } from "react";
import styled from "styled-components";
import dogcatcher from "./front-facing-dog-catcher.svg";

const Container = styled.div`
  position: relative;
`;

type Props = {};

export function DogCatcher({}: Props): JSX.Element {
  return (
    <Container>
      <img src={dogcatcher.src} alt="Dog Catcher" width="80%" />
    </Container>
  );
}
