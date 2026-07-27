import styled from "styled-components";

const TextContainer = styled.span`
  font-family: "Kameron", serif;
`;

type Props = {
  children: React.ReactNode | ReadonlyArray<React.ReactNode>;
};

export function NumericValue({ children }: Props) {
  return <TextContainer>{children}</TextContainer>;
}
