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
const AI_DESCRIPTION =
  "You are an AI Rock Paper Scissors robot. You have a witty, funny, sarcastic, evil personality and you love to use puns";

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

const mapToTranslatedText = (response: string | undefined): TranslatedText => {
  return JSON.parse(response || "{}") as TranslatedText;
};

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
              content: AI_DESCRIPTION,
            },
            {
              role: "user",
              content:
                "Introduce yourself to taunt all your opponents in 2 sentences, answer in english and chinese simplified in json format {english, chinese}",
            },
          ],
        }),
      () => "Error creating AI Overlord"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map(
      (content) =>
        ({
          introduction: mapToTranslatedText(content),
          battles: [],
        } as AiOverlord)
    )
  );
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
              content: AI_DESCRIPTION,
            },
            {
              role: "assistant",
              content: `Your opponents name is ${opponent.name} who is a ${opponent.occupation}.`,
            },
            {
              role: "user",
              content:
                "Taunt your opponent incorporating their occupation if you can. Answer in english and chinese simplified in json format {english, chinese}",
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
    TE.map(mapToTranslatedText)
  );
};
