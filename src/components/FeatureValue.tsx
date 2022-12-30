import styled from "styled-components";
import { COLORS } from "../colors";

const Container = styled.div`
  width: 10vw;
  height: 10vw;
  background-color: white;
  border-radius: 50%;
  border: 1rem solid ${COLORS.borderPrimary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div``;
const Value = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

type Props = {
  value: number;
  label?: string;
};

export function FeatureValue({ value, label = "" }: Props): JSX.Element {
  return (
    <Container>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Container>
  );
}
