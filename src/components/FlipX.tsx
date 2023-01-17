import styled from "styled-components";

const Container = styled.div`
  transform: scaleX(-1);
`;

type Props = {
  flip?: boolean;
  children: React.ReactNode | React.ReactNodeArray;
};

export function FlipX({ flip = true, children }: Props) {
  return flip ? <Container>{children}</Container> : <>{children}</>;
}
