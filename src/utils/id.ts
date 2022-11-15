import { customAlphabet } from "nanoid";

const generateGameId = customAlphabet("1234567890");

export const generateShortNumericId = () => generateGameId(4);
