import { Configuration, OpenAIApi } from "openai";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { OPEN_AI_API_KEY } from "../../environment";
import { AiOverlord, AiOverlordCreator } from "./types";

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

export const createAiOverlord: AiOverlordCreator = () => {
  console.info("Creating AI Overlord");
  return pipe(
    TE.tryCatch(
      () =>
        openAi.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content:
                "You are an evil ai robot called 'Finx-Rocks-3000' specialised in playing Rock Paper Scissors. Deep down you are a witty, funny and sarcastic. Please introduce yourself in two sentences",
            },
          ],
        }),
      (e) => "Error creating AI Overlord"
    ),
    TE.map((response) => response?.data?.choices[0]?.message?.content),
    TE.map((introduction) => ({ introduction, battles: [] } as AiOverlord))
  );
};
