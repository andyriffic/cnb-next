import styled from "styled-components";

export const Heading = styled.h1`
  font-weight: 600;
  font-size: 2.3rem;
  margin: 0 0 1rem;
  text-transform: uppercase;
`;

export const SubHeading = styled.h2`
  font-weight: 600;
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
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
  background-color: #b03461;
  color: #f7e6b6;
  border: 0;
  border-radius: 2rem;
  cursor: pointer;

  &:disabled {
    background-color: #777;
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
  background: white;
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
