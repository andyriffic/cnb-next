import { ENVIRONMENT_NAME } from "../../environment";

export default async function handler(req: any, res: any) {
  // Rest of the API logic
  res.json({
    message: "Hello Everyone :)",
    environment: ENVIRONMENT_NAME,
  });
}
