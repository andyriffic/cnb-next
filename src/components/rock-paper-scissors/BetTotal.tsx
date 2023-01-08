import { useMemo, useState } from "react";
import styled from "styled-components";
import { useTrail, animated, config } from "@react-spring/web";
import { COLORS } from "../../colors";

const Container = styled.div`
  width: 5vw;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  gap: 0.5rem;
`;

const Label = styled.div``;
const Value = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const BetPill = styled(animated.div)`
  font-size: 2rem;
`;

type Props = {
  betValue: number;
  totalBetValue: number;
};

export function BetTotal({ betValue, totalBetValue }: Props): JSX.Element {
  const trails = useTrail(betValue, {
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1,
    config: config.slow,
  });

  return (
    <Container>
      {/* <Value>
        {betValue}/{totalBetValue}
      </Value> */}
      {trails.map((style, i) => (
        <BetPill key={i} style={style}>
          🍒
        </BetPill>
      ))}
    </Container>
  );
}
