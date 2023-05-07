const QaHistory = require("../models/QaHistory");
const User = require("../models/User");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: `${process.env.AWS_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

const uploadToS3 = async (file, keyPrefix = "embeddings") => {
  const fileName = `${Date.now()}-embeddings.json`;
  const fileContent = JSON.stringify(file);

  const params = {
    Bucket: `${process.env.AWS_S3_PROFILE_BUCKET_NAME}`,
    Key: `${keyPrefix}/${fileName}`,
    Body: fileContent,
    ContentType: "application/json",
  };

  return new Promise((resolve, reject) => {
    s3.send(new PutObjectCommand(params), (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(
          `https://${process.env.AWS_S3_PROFILE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
        );
      }
    });
  });
};

const downloadFromS3 = async (embeddingsUrl) => {
  const s3Params = {
    Bucket: `${process.env.AWS_S3_PROFILE_BUCKET_NAME}`,
    Key: embeddingsUrl.split("/").slice(-2).join("/"),
  };

  const getObjectCommand = new GetObjectCommand(s3Params);

  try {
    const response = await s3Client.send(getObjectCommand);
    const responseBody = await new Promise((resolve, reject) => {
      const chunks = [];
      response.Body.on("data", (chunk) => chunks.push(chunk));
      response.Body.on("error", reject);
      response.Body.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const embeddings = JSON.parse(responseBody.toString());
    return embeddings;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to download embeddings from S3");
  }
};

exports.createQaHistory = async (req, res) => {
  const { userId, chatId, qa, embeddings } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const embeddingsUrl = await uploadToS3(embeddings);

    const newQaHistory = new QaHistory({
      user: userId,
      chat: chatId,
      qa,
      embeddingsUrl,
    });

    await newQaHistory.save();

    res.status(201).json(newQaHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateQaHistory = async (req, res) => {
  const { id } = req.params;
  const { userId, chatId, qa, embeddings } = req.body;

  try {
    const qaHistory = await QaHistory.findById(id);
    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    qaHistory.user = userId;
    qaHistory.chat = chatId;
    qaHistory.qa = qa;

    if (embeddings) {
      const embeddingsUrl = await uploadToS3(embeddings);
      qaHistory.embeddingsUrl = embeddingsUrl;
    }

    await qaHistory.save();

    res.status(200).json(qaHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteQaHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const qaHistory = await QaHistory.findById(id);
    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    await QaHistory.findByIdAndDelete(id);

    res.status(200).json({ message: "QA History deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQaHistoryByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const qaHistories = await QaHistory.find({ user: userId });

    res.status(200).json(qaHistories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQaHistoryByChatId = async (req, res) => {
  const { chatId } = req.params;

  try {
    const qaHistory = await QaHistory.findOne({ chat: chatId });

    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    res.status(200).json(qaHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmbeddingsByChatId = async (req, res) => {
  try {
    const { chat_id } = req.params;

    // Find the QaHistory entry by chat_id
    const qaHistory = await QaHistory.findOne({ chat: chat_id });

    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    // Download the embeddings from S3
    const embeddings = await downloadFromS3(qaHistory.embeddingsUrl);

    res.status(200).json(embeddings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
