import styled, { css } from "styled-components";

export const EvenlySpaced = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const CenterSpaced = styled.div<{ stacked?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-direction: ${({ stacked }) => (stacked ? "column" : "row")};
`;
