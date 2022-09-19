export default async function handler(req: any, res: any) {
  // Rest of the API logic
  res.json({
    message: "Hello Everyone :)",
    secret: process.env.SUPER_SECRET || "not found",
  });
}
