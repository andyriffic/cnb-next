type Props = {
  winningPlayerId: string;
};

export const WinningPlayer = ({ winningPlayerId }: Props) => {
  return <div>Winning Player: {winningPlayerId}</div>;
};
