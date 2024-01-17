import styled from "styled-components";
import Link from "next/link";

import THEME from "../themes/types";

export const FeatureHeading = styled.h1`
  font-size: 15rem;
  margin: 0;
  text-transform: uppercase;
  font-family: ${THEME.fonts.feature};
  color: ${THEME.colours.primaryText};
  text-shadow: 4px 4px ${THEME.colours.textAccent};
  line-height: 80%;
`;

export const FeatureSubHeading = styled.h2`
  font-size: 2rem;
  margin: 0;
  font-family: ${THEME.fonts.body};
  color: ${THEME.colours.primaryText};
  letter-spacing: 0.2rem;
`;

export const SmallHeading = styled.h3<{ centered?: boolean }>`
  font-size: 2rem;
  margin: 0;
  font-family: ${THEME.fonts.feature};
  color: ${THEME.colours.primaryText};
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  text-align: ${({ centered }) => (centered ? "center" : "left")};
`;

export const NormalText = styled.p`
  font-size: 1rem;
  margin: 0;
  font-family: ${THEME.fonts.body};
  color: ${THEME.colours.primaryText};
`;

export const ThemedPrimaryLinkButton = styled(Link)`
  display: block;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.4rem;
  text-decoration: none;
  background: linear-gradient(
    ${THEME.colours.buttonPrimaryBackground},
    ${THEME.colours.buttonSecondaryBackground}
  );
  color: ${THEME.colours.buttonPrimaryText};
  border: 0;
  box-shadow: 0 4px ${THEME.colours.buttonAccent};
  border-radius: 2rem;

  &:disabled {
    background: #777;
  }
`;

export const ThemedPrimaryButton = styled.button`
  display: block;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.4rem;
  text-decoration: none;
  background: linear-gradient(
    ${THEME.colours.buttonPrimaryBackground},
    ${THEME.colours.buttonSecondaryBackground}
  );
  color: ${THEME.colours.buttonPrimaryText};
  border: 0;
  box-shadow: 0 4px ${THEME.colours.buttonAccent};
  border-radius: 2rem;
  cursor: pointer;

  &:disabled {
    background: #777;
    opacity: 0.8;
  }
`;

export const Pill = styled.div`
  background-color: ${THEME.colours.primaryBackground};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: inline-block;
`;

export const Heading = styled.h1`
  font-weight: 600;
  font-size: 2.3rem;
  margin: 0;
  text-transform: uppercase;
`;

export const SubHeading = styled.h2`
  font-weight: 600;
  font-size: 1.4rem;
  margin: 0;
`;

export const FeatureEmoji = styled.div`
  font-size: 4rem;
`;

export const CaptionText = styled.p``;

export const PrimaryButton = styled.button`
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.4rem;
  text-transform: uppercase;
  background-color: #ea4630;
  color: #f8b229;
  border: 0;
  border-radius: 2rem;
  cursor: pointer;

  &:disabled {
    background-color: rgb(234, 70, 48, 0.6);
    opacity: 0.8;
  }
`;

export const PrimaryLinkButton = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.4rem;
  text-transform: uppercase;
  text-decoration: none;
  background-color: #b03461;
  color: #f7e6b6;
  border: 0;
  border-radius: 2rem;

  &:disabled {
    background-color: #777;
    opacity: 0.8;
  }
`;

export const Label = styled.label`
  font-weight: 500;
`;

export const Card = styled.div`
  background: ${THEME.colours.secondaryBackground};
  color: ${THEME.colours.primaryText};
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 0.5rem solid transparent;
`;

export const CenteredCard = styled(Card)`
  text-align: center;
`;

export const BigInput = styled.input`
  font-size: 5rem;
  /* max-width: 100%; */
  text-align: center;
  padding: 0.8rem 0;
  display: block;
  width: 60vw;
  border: 0.2rem solid #05a9c7;
  background-color: #f7e6b6;
  border-radius: 1rem;
  margin: 1rem 0;
`;
