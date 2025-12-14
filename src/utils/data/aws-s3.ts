export const blah = "";
// import { S3Client, PutObjectCommand, GetObjectCommand, NoSuchKey, S3ServiceException } from "@aws-sdk/client-s3";
// import { AWS_REGION } from "../../constants";
// import { DYNAMO_DB_ACCESS_KEY, DYNAMO_DB_ACCESS_KEY_SECRET } from "../../environment";

// const s3Client = new S3Client({
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: DYNAMO_DB_ACCESS_KEY,
//     secretAccessKey: DYNAMO_DB_ACCESS_KEY_SECRET,
//   },
// }); // Replace with your region

// const writeJsonToS3 = async (
//   bucketName: string,
//   key: string,
//   data: any
// ): Promise<void> => {
//   const jsonString = JSON.stringify(data, null, 2); // Serialize the data

//   const command = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//     Body: jsonString,
//     ContentType: "application/json",
//   });

//   try {
//     await s3Client.send(command);
//     console.log(`Successfully wrote JSON to s3://${bucketName}/${key}`);
//   } catch (err) {
//     console.error("Error writing to S3:", err);
//     throw err;
//   }
// };

// const readJsonFromS3 = async ({ bucketName, key }) => {
//   const client = new S3Client({});
//   const date = new Date();
//   date.setDate(date.getDate() - 1);
//   try {
//     const response = await client.send(
//       new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//         IfUnmodifiedSince: date,
//       }),
//     );
//     // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
//     if (!response.Body) {
//       throw new Error("No response body");
//     }

//     const str = await response.Body.transformToString();
//     console.log("Success. Here is text of the file:", str);
//   } catch (caught) {
//     if (caught instanceof NoSuchKey) {
//       console.error(
//         `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`,
//       );
//     } else if (caught instanceof S3ServiceException) {
//       console.error(
//         `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
//       );
//     } else {
//       throw caught;
//     }
//   }
// };

// // Example Usage:
// const myDataObject = {
//   id: 123,
//   name: "Sample Data",
//   timestamp: new Date().toISOString(),
// };

// // await writeJsonToS3("your-bucket-name", "path/to/data.json", myDataObject);
