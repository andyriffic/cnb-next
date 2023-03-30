import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { Configuration, OpenAIApi } from "openai";
import { OPEN_AI_API_KEY } from "../../environment";
import {
  AiOverlord,
  AiOverlordCreator,
  AiOverlordTauntCreator,
  TranslatedText,
} from "./types";

const AI_MODEL = "gpt-3.5-turbo";

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

export const createAiOverlord: AiOverlordCreator = (opponents) => {
  console.info("Creating AI Overlord");
  return pipe(
    TE.tryCatch(
      () =>
        openAi.createChatCompletion({
          model: AI_MODEL,
          messages: [
            {
              role: "user",
              content:
                "You are an evil ai robot specialised in playing Rock Paper Scissors. Your personality is witty, funny, sarcastic and you love puns. You can name yourself",
            },
            {
              role: "user",
              content: `You will be playing ${opponents.length} opponents. You will play each opponent once. if you beat them all then you will win. If you lose to them all, they will win.`,
            },
            {
              role: "user",
              content: "Introduce yourself to your opponents in 2 sentences",
            },
          ],
        }),
      () => "Error creating AI Overlord"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((introduction) => ({ introduction, battles: [] } as AiOverlord))
  );
};

export const mapStringResponseToAiOverlordBattleMoveAndTaunt = (
  response: string | undefined
): TranslatedText => {
  return JSON.parse(response || "{}") as TranslatedText;
};

export const createAiBattleTaunt: AiOverlordTauntCreator = (
  opponent,
  aiOverlordGame
) => {
  return pipe(
    TE.tryCatch(
      () =>
        openAi.createChatCompletion({
          model: AI_MODEL,
          messages: [
            {
              role: "assistant",
              content:
                "You are a witty, funny, sarcastic, evil AI Rock Paper Scissors robot who likes to use puns whenever you can.",
            },
            {
              role: "assistant",
              content: `Your opponents name is ${opponent.name} who is a ${opponent.occupation}. `,
            },
            {
              role: "user",
              content:
                "Introduce yourself to your opponent in english and chinese simplified in json format {english, chinese}",
            },
          ],
        }),
      () => "Error creating AI Overlord Battle"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map(mapStringResponseToAiOverlordBattleMoveAndTaunt)
  );
};
