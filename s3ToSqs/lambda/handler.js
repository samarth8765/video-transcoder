const dotenv = require("dotenv");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({});
dotenv.config();

module.exports.s3ToSqs = async (event) => {
  const s3Event = event.Records[0].s3;
  const bucket = s3Event.bucket.name;
  const key = decodeURIComponent(s3Event.object.key.replace(/\+/g, " "));

  const message = {
    Bucket: bucket,
    Key: key,
  };

  const params = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify(message),
    MessageGroupId: "default",
  };

  try {
    const command = new SendMessageCommand(params);
    await sqsClient.send(command);
    console.log("Message sent to SQS:", message);
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw error;
  }
};
