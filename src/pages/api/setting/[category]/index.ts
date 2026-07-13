import type { NextApiRequest, NextApiResponse } from "next";
import { getSetting } from "../../../../utils/data/aws-dynamodb-settings";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { category } = query;

  switch (method) {
    case "GET": {
      console.log("GETTING settings", category);
      const settingOrNull = await getSetting(category as string);
      console.info("Got setting", settingOrNull);

      if (!settingOrNull) {
        res.status(404).end();
        return;
      }
      res.status(200).json(settingOrNull);
      break;
    }

    default: {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
