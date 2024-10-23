import Image from "next/image";
import styled from "styled-components";

const Container = styled.div`
  // display: flex;
`;

type Props = {
  totalCoins: number;
};

export function Coins({ totalCoins }: Props) {
  const coinImages = Array.from({ length: totalCoins }, (_, i) => (
    <Image key={i} src="/images/coin.webp" width={26} height={26} alt="coin" />
  ));

  return <Container>{coinImages.map((_) => _)}</Container>;
}
