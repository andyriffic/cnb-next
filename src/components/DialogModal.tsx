import styled from "styled-components";
import { Card, PrimaryButton } from "./Atoms";
import { CenterSpaced, EvenlySpaced } from "./Layouts";

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(100, 100, 100, 0.8);
`;

const DialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 2rem;
  transform: translate3d(-50%, -50%, 0);
  font-size: 2rem;
`;

const DialogBodyContainer = styled.div`
  margin-bottom: 2rem;
`;

const DialogOptionsContainer = styled.div``;

type Props = {
  options: { text: string; onSelected: () => void }[];
  show: boolean;
  children: React.ReactNode | React.ReactNodeArray;
};

export function DialogModal({ children, options, show }: Props) {
  return show ? (
    <FullScreenBackground>
      <DialogContainer>
        <Card>
          <CenterSpaced stacked={true}>
            <DialogBodyContainer>{children}</DialogBodyContainer>
            <DialogOptionsContainer>
              <EvenlySpaced>
                {options.map((option, i) => (
                  <PrimaryButton key={i} onClick={option.onSelected}>
                    {option.text}
                  </PrimaryButton>
                ))}
              </EvenlySpaced>
            </DialogOptionsContainer>
          </CenterSpaced>
        </Card>
      </DialogContainer>
    </FullScreenBackground>
  ) : null;
}
