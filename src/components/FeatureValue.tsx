import styled from "styled-components";
import { COLORS } from "../colors";
import THEME from "../themes/types";
import { NumericValue } from "./NumericValue";

const Container = styled.div`
  width: 5vw;
  height: 5vw;
  background: ${THEME.colours.secondaryBackground};
  color: ${THEME.colours.primaryText};
  border-radius: 50%;
  border: 0.4rem solid ${COLORS.borderPrimary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div``;
const Value = styled.div`
  font-size: 2.5rem;
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
      <Value>
        <NumericValue> {value}</NumericValue>
      </Value>
    </Container>
  );
}
