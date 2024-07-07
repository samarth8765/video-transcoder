import express from "express";
import cors from "cors";
import { S3Client, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

app.post("/generate-presigned-url", async (req, res) => {
  try {
    console.log("Begin");
    const { fileName, fileType } = req.body;
    console.log(process.env.BUCKET_NAME);
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(client, command, {
      expiresIn: 1800,
    });
    console.log("done");
    return res.status(201).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating presigned URL" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
