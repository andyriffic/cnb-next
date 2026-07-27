import styled from "styled-components";

const TextContainer = styled.span`
  font-family: "Noto Sans SC", sans-serif;
`;

type Props = {
  children: React.ReactNode | ReadonlyArray<React.ReactNode>;
};

export function ChineseText({ children }: Props) {
  return <TextContainer>{children}</TextContainer>;
}
