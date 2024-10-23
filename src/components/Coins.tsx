import Image from "next/image";

type Props = {
  totalCoins: number;
};

export function Coins({ totalCoins }: Props) {
  return (
    <Image src="/images/coin.webp" width={26} height={26} alt="spinning coin" />
  );
}
