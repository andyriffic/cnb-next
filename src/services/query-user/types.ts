export type QuestionsByPlayerId = {
  [playerId: string]: QueryUserQuestion<string | number>;
};

export type QueryUserQuestion<T = string> = {
  id: string;
  style: "normal" | "emoji" | "emoji-stack";
  title?: string;
  question: string;
  options: QueryUserOption<T>[];
  selectedOptionIndex?: number;
};

export type QueryUserOption<T = string> = {
  text: string;
  value: T;
};
