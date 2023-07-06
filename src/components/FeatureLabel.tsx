import styled from "styled-components";

const Label = styled.div`
  background-color: goldenrod;
  color: black;
  padding: 0.8rem;
  font-size: 0.8rem;
`;

type Props = {
  text: string;
};

export function FeatureLabel({ text }: Props) {
  return <Label>{text}</Label>;
}
