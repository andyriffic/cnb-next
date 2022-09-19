export default async function handler(req: any, res: any) {
  // Rest of the API logic
  res.json({
    message: "Hello Everyone :)",
    secret: process.env.TEST_SUPER_SECRET || "not found",
    secret2: process.env.SECRET_TEST_2 || "not found",
  });
}
