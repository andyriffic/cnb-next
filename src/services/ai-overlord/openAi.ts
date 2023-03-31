import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { Configuration, OpenAIApi } from "openai";
import { OPEN_AI_API_KEY } from "../../environment";
import { RPSMoveName } from "../rock-paper-scissors/types";
import {
  AiOverlord,
  AiOverlordBattleOutcomeCreator,
  AiOverlordCreator,
  AiOverlordMoveCreator,
  AiOverlordTauntCreator,
  TranslatedText,
} from "./types";

const AI_MODEL = "gpt-3.5-turbo";
const AI_DESCRIPTION =
  "You are an AI Rock Paper Scissors robot. You have a witty, funny, sarcastic, evil personality and you love to use puns. You are playing against a team of IT workers who all work in the Home Loans department of a Property listings website company";

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

function parseToJson<T>(response: string | undefined): T {
  return JSON.parse(response || "{}") as T;
}

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
                "Introduce yourself to taunt all your opponents in 2 sentences, answer in english and chinese simplified in json format {english: string, chinese: string}",
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
          introduction: parseToJson<TranslatedText>(content),
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
                "Taunt your opponent incorporating their occupation if you can. Answer in english and chinese simplified in json format {english: string, chinese: string}",
            },
          ],
        }),
      () => "Error creating AI Overlord Tuant"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => parseToJson<TranslatedText>(response))
  );
};

export const createAiBattleMove: AiOverlordMoveCreator = (
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
              role: "user",
              content:
                "choose a move of rock, paper or scissors. respond in json format {move: rock|paper|scissors}",
            },
          ],
        }),
      () => "Error creating AI Overlord Move"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => parseToJson<{ move: RPSMoveName }>(response)),
    TE.map((response) => response.move)
  );
};

export const createAiBattleOutcome: AiOverlordBattleOutcomeCreator = (
  opponent,
  opponentMove,
  overlordMove
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
              role: "assistant",
              content: `Your opponents move is ${opponentMove}`,
            },
            {
              role: "assistant",
              content: `Your move is ${overlordMove}`,
            },
            {
              role: "user",
              content:
                "Make a comment on the outcome of the game in no more than 2 sentences, Answer in english and chinese simplified in json format {english: string, chinese: string}",
            },
          ],
        }),
      () => "Error creating AI Overlord Outcome"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => parseToJson<TranslatedText>(response))
  );
};
