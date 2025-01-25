import { useState } from "react";
import styled from "styled-components";
import { NumberCrunchGameView } from "../../../services/number-crunch/types";
import {
  BigInput,
  FeatureHeading,
  SmallHeading,
  ThemedPrimaryButton,
} from "../../Atoms";

import THEME from "../../../themes";

const Container = styled.div`
  margin-bottom: 3rem;
`;

const SliderInput = styled.input`
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;

  &:focus {
    outline: none;
  }

  /* https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers/ */

  &:focus::-moz-range-thumb {
    border: 0.1rem solid #f50fd3;
    outline: 0.3rem solid #f50fd3;
    outline-offset: 0.125rem;
  }

  &::-moz-range-track {
    background: #053a5f;
    height: 2rem;
    border-radius: 1rem;
  }

  &::-moz-range-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track */
    background-color: #5cd5eb;
    height: 4rem;
    width: 4rem;
    border: none; /*Removes extra border that FF applies*/
    border-radius: 50%;
  }

  /***** Chrome, Safari, Opera and Edge Chromium styles *****/
  /* slider track */
  &::-webkit-slider-runnable-track {
    background-color: #053a5f;
    height: 2rem;
    border-radius: 1rem;
  }

  /* slider thumb */
  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -1rem;

    /*custom styles*/
    background-color: #5cd5eb;
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
  }

  &:focus::-webkit-slider-thumb {
    border: 0.1rem solid #f50fd3;
    outline: 0.3rem solid #f50fd3;
    outline-offset: 0.125rem;
  }

  /******** Firefox styles ********/
  /* slider track */
  &::-moz-range-track {
    background-color: #053a5f;
    height: 2rem;
    border-radius: 1rem;
  }

  /* slider thumb */
  &::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/

    /*custom styles*/
    background-color: #5cd5eb;
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
  }

  &:focus::-moz-range-thumb {
    border: 0.1rem solid #f50fd3;
    outline: 0.3rem solid #f50fd3;
    outline-offset: 0.125rem;
  }
`;

type Props = {
  game: NumberCrunchGameView;
  startingNumber?: number;
  hint?: string;
  onSelected: (val: number) => void;
};

export const PlayerSelectNumber = ({ game, hint, onSelected }: Props) => {
  const [val, setVal] = useState(game.currentRound.range.low);

  return (
    <Container>
      {/* <BigInput
        type="number"
        min={game.currentRound.range.low}
        max={game.currentRound.range.high}
        disabled={true}
        value={val}
      />
 */}
      <SmallHeading style={{ textAlign: "center", marginBottom: "1rem" }}>
        Guess the number between {game.currentRound.range.low} &{" "}
        {game.currentRound.range.high}
      </SmallHeading>
      {hint && (
        <SmallHeading
          style={{
            textAlign: "center",
            color: THEME.tokens.colours.buttonPrimaryText,
          }}
        >
          Hint: {hint}
        </SmallHeading>
      )}
      <FeatureHeading style={{ textAlign: "center" }}>{val}</FeatureHeading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSelected(val);
        }}
      >
        <div style={{ margin: "4rem 0" }}>
          <SliderInput
            type="range"
            min={game.currentRound.range.low}
            max={game.currentRound.range.high}
            step={1}
            value={val}
            onChange={(e) => setVal(e.target.valueAsNumber)}
          />
        </div>
        <ThemedPrimaryButton type="submit">Submit</ThemedPrimaryButton>
      </form>
    </Container>
  );
};
