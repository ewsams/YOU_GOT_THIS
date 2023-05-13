const QaHistory = require("../models/QaHistory");
const User = require("../models/User");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: `${process.env.AWS_REGION_OREGON}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

const uploadToS3 = async (file, keyPrefix = "embeddings") => {
  const fileName = `${Date.now()}-embeddings.json`;
  const fileContent = JSON.stringify(file);

  const params = {
    Bucket: `${process.env.AWS_S3_EMBEDDINGS_BUCKET}`,
    Key: `${keyPrefix}/${fileName}`,
    Body: fileContent,
    ContentType: "application/json",
  };

  return new Promise((resolve, reject) => {
    s3Client.send(new PutObjectCommand(params), (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(
          `https://${process.env.AWS_S3_EMBEDDINGS_BUCKET}.s3.${process.env.AWS_REGION_OREGON}.amazonaws.com/${params.Key}`
        );
      }
    });
  });
};


const downloadFromS3 = async (embeddingsUrl) => {
  const s3Params = {
    Bucket: `${process.env.AWS_S3_EMBEDDINGS_BUCKET}`,
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
  const { userId, qa, embeddings, mediaType, title } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const embeddingsUrl = await uploadToS3(embeddings);

    const newQaHistory = new QaHistory({
      userId,
      qa,
      embeddingsUrl,
      mediaType,
      title,
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
  const { userId, qa, embeddings, mediaType, title } = req.body;

  try {
    const qaHistory = await QaHistory.findById(id);
    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    qaHistory.userId = userId;
    qaHistory.qa = qa;
    qaHistory.mediaType = mediaType;
    qaHistory.title = title;

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
    const qaHistories = await QaHistory.find({ userId: userId });

    res.status(200).json(qaHistories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQaHistoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const qaHistory = await QaHistory.findById(id);

    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    res.status(200).json(qaHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmbeddingsByQaHistoryId = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the QaHistory entry by id
    const qaHistory = await QaHistory.findById(id);

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

exports.getQaHistoriesByUserIdAndType = async (req, res) => {
  const { userId } = req.params;
  const { mediaType, page = 1, limit = 5 } = req.query;

  try {
    let query = QaHistory.find({ userId: userId });

    if (mediaType) {
      query = query.where("mediaType", mediaType);
    }

    const totalCount = await QaHistory.countDocuments(query);

    query = query
      .sort("-created_at")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const qaHistories = await query.exec();

    res.status(200).json({
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      qaHistories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateQaHistoryTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const qaHistory = await QaHistory.findById(id);
    if (!qaHistory) {
      return res.status(404).json({ message: "QA History not found" });
    }

    qaHistory.title = title;

    await qaHistory.save();

    res.status(200).json(qaHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



