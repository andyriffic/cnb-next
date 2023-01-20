import { animated, useTransition } from "@react-spring/web";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
`;

export type AnimatedItem = {
  id: string | number;
  show?: boolean;
  content: React.ReactElement;
};

type Props = {
  items: AnimatedItem[];
};

const WIDTH = 50;

export function AnimatedList({ items }: Props) {
  const transitions = useTransition(
    items.map((item, i) => ({ ...item, x: i * WIDTH })),
    {
      key: (item: AnimatedItem) => item.id,
      from: { position: "absolute", opacity: 0, top: -50 },
      leave: { opacity: 0, top: 50 },
      enter: ({ x }) => ({ x, opacity: 1, top: 0 }),
      update: ({ x }) => ({ x }),
    }
  );

  return (
    <Container>
      {transitions((style, item, t, index) => (
        <animated.div style={{ zIndex: items.length - index, ...style }}>
          {item.content}
        </animated.div>
      ))}
    </Container>
  );
}
