import { SubHeading } from "../../Atoms";

type Props = {
  totalCoins: number;
};

export const CoinDisplay = ({ totalCoins }: Props) => {
  return <SubHeading>{totalCoins} coins</SubHeading>;
};
