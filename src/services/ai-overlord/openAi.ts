import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { OPEN_AI_API_KEY } from "../../environment";
import { RPSMoveName } from "../rock-paper-scissors/types";
import {
  AiOverlord,
  AiOverlordBattleOutcomeCreator,
  AiOverlordCreator,
  AiOverlordMoveCreator,
  AiOverlordOpponentResult,
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

function parseToJson<T>(response: string | undefined): E.Either<string, T> {
  try {
    return E.right(JSON.parse(response || "{}") as T);
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    return E.left(message);
  }
}

function trimLeftCurlyBrace(text: string): string {
  return text.substring(text.indexOf("{"));
}

function trimRightCurlyBrace(text: string): string {
  return text.substring(0, text.lastIndexOf("}") + 1);
}

function trimOutsidesOfCurlyBraces(text: string): string {
  return pipe(text, trimLeftCurlyBrace, trimRightCurlyBrace);
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
              role: "system",
              content: AI_DESCRIPTION,
            },
            {
              role: "user",
              content:
                "Start by introducing yourself to your opponents by using a pun or a joke in 2 sentences. Answer in english and chinese simplified. Your answer is for a computer program so you must only respond in json format of {english: string, chinese: string}",
            },
          ],
        }),
      () => "Error creating AI Overlord"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((response) => trimOutsidesOfCurlyBraces(response || "")),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((content) => parseToJson<TranslatedText>(content)),
    TE.chain(
      E.fold(
        (parseError) => TE.left(parseError),
        (translatedText) =>
          TE.right({ introduction: translatedText, moves: [] } as AiOverlord)
      )
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
              role: "system",
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
    TE.map((response) => trimOutsidesOfCurlyBraces(response || "")),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => parseToJson<TranslatedText>(response)),
    TE.chain(
      E.fold(
        (parseError) => TE.left(parseError),
        (translatedText) => TE.right(translatedText)
      )
    )
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
              role: "system",
              content: AI_DESCRIPTION,
            },
            {
              role: "assistant",
              content:
                aiOverlordGame.aiOverlord.moves.length > 0
                  ? `Your previous move history from oldest to newest is ${aiOverlordGame.aiOverlord.moves
                      .map((m) => m.move)
                      .join(", ")}`
                  : "This is your first move",
            },
            {
              role: "user",
              content:
                "Choose one random move of rock, paper or scissors. Your answer is for a computer program so you must only respond in json format of {move: string}",
            },
          ],
        }),
      () => "Error creating AI Overlord Move"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((response) => trimOutsidesOfCurlyBraces(response || "")),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => parseToJson<{ move: RPSMoveName }>(response)),
    TE.chain(
      E.fold(
        (parseError) => TE.left(parseError),
        (response) => TE.right(response.move)
      )
    )
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
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: AI_DESCRIPTION,
    },
    {
      role: "assistant",
      content: `Your opponents name is ${opponent.name} who is a ${opponent.occupation}`,
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
      role: "assistant",
      content:
        "If you win, you like to make fun of your opponent, if you lose you like to make fun of yourself. If it's a draw you make up some funny reason why you are both winners or losers",
    },
    {
      role: "user",
      content:
        "Using your move and your opponents moves make a comment on the outcome of the game in no more than 2 sentences Answer in both english and chinese simplified language. Give an outcome if it is a win, lose or draw for you. Your answer is for a computer program so you must respond in json format of {english: string, chinese: string, outcome: string}",
    },
  ];

  console.log("Messages", messages);

  return pipe(
    TE.tryCatch(
      () =>
        openAi.createChatCompletion({
          model: AI_MODEL,
          messages,
        }),
      () => "Error creating AI Overlord Outcome"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((content) => {
      console.log(content);
      return content;
    }),
    TE.map((response) => trimOutsidesOfCurlyBraces(response || "")),
    TE.map((cleanedResponse) =>
      parseToJson<{ outcome: AiOverlordOpponentResult } & TranslatedText>(
        cleanedResponse
      )
    ),
    TE.chain(
      E.fold(
        (parseError) => TE.left(parseError),
        (response) =>
          TE.right({
            text: response,
            move: overlordMove,
            opponentId: opponent.playerId,
            outcome: response.outcome,
          })
      )
    )
  );
};
