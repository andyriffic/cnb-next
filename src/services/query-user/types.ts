export type QuestionsByPlayerId = {
  [playerId: string]: QueryUserQuestion<string | number>;
};

export type QueryUserQuestion<T = string> = {
  id: string;
  style: "normal";
  title?: string;
  question: string;
  options: QueryUserOption<T>[];
  selectedOptionId?: string;
};

export type QueryUserOption<T = string> = {
  id: string;
  text: string;
  value: T;
};
