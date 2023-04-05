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
                "Start by introducing yourself to taunt all your opponents in 2 sentences, answer in english and chinese simplified in json format {english: string, chinese: string}",
            },
            {
              role: "user",
              content:
                "Your answer is for a computer program so you must only respond in json format of {english: string, chinese: string}",
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
          moves: [],
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
              content: `Your current opponent is ${opponent.name} who is a ${opponent.occupation}.`,
            },
            {
              role: "user",
              content:
                "Taunt your current opponent incorporating their occupation if you can. You must always mention their name. Answer in english and chinese simplified. Your answer is for a computer program so you must respond in json format of {english: string, chinese: string}",
            },
          ],
        }),
      () => "Error creating AI Overlord Taunt"
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
              role: "assistant",
              content: `Your previous move history from oldest to newest is ${aiOverlordGame.aiOverlord.moves
                .map((m) => m.move)
                .join(", ")}`,
            },
            {
              role: "user",
              content:
                "Start by choosing a random move of rock, paper or scissors. Your answer is for a computer program so you must only respond in json format with your move of {move: string} and nothing else",
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
  overlordMove,
  aiOverlordGame
) => {
  console.log(
    "[OpenAI] Creating outcome",
    opponent.name,
    opponentMove,
    overlordMove
  );
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
              content: `Your opponents move was ${opponentMove}`,
            },
            {
              role: "assistant",
              content: `Your move was ${overlordMove}`,
            },
            {
              role: "user",
              content:
                "State the outcome of the game stating your move and your opponents moves. Using your personality, make a comment on the outcome of the game in no more than 2 sentences.",
            },
            {
              role: "user",
              content:
                "If you win, you like to make fun of your opponent, if you lose you like to make fun of yourself. If it's a draw you make up some cosmic reason why you are both winners or losers",
            },
            {
              role: "user",
              content:
                "Your answer is for a computer program so you must respond in json format of {english: string, chinese: string}",
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
    TE.map((response) => parseToJson<TranslatedText>(response)),
    TE.map((translatedText) => ({
      text: translatedText,
      move: overlordMove,
      opponentId: opponent.playerId,
    }))
  );
};
