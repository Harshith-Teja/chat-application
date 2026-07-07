import Message from "../model/messagesModel.js";
import Channel from "../model/channelModel.js";
import OpenAI from "openai";
import { mkdirSync, renameSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2)
      return res.status(400).send("Both user Id's are required");

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).send("File is required");

    const date = Date.now();
    let fileDir = `./uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path, fileName);

    return res.status(200).json({ filePath: fileName });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Initializing OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeMissedMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { lastReadTimestamp } = req.body;

    if (!lastReadTimestamp) {
      return res.status(400).json({
        error: "lastReadTimestamp is required to summarize missed messages.",
      });
    }

    console.log("lastReadTimestamp", lastReadTimestamp);

    //Query the Channel and populate only the missed messages
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      match: { timestamp: { $gt: new Date(lastReadTimestamp) } },
      options: { sort: { timestamp: 1 } }, // Sort chronologically so the chat makes sense
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found." });
    }

    const missedMessages = channel.messages;

    console.log("missedMsg", missedMessages);
    if (!missedMessages || missedMessages.length === 0) {
      return res
        .status(200)
        .json({ summary: "You have no missed messages to summarize." });
    }

    //Format the chat log for the AI
    let chatLog = missedMessages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    // Safe Truncation Logic
    // We apply the industry heuristic that 1 token is approximately 4 characters.
    // Capping at 4,000 characters keeps our payload around 1,000 tokens.
    const MAX_CHARS = 4000;

    if (chatLog.length > MAX_CHARS) {
      const truncated = chatLog.substring(0, MAX_CHARS); // Cut the text off at the limit
      const lastSpaceIndex = truncated.lastIndexOf(" "); // Cleanly stop at the last full word so the AI does not get confused by a partial word

      chatLog =
        truncated.substring(0, lastSpaceIndex) +
        "\n...[Messages truncated for length]";
    }

    //Prompt Engineering & API Call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and highly cost-effective for simple summarization
      messages: [
        {
          role: "system",
          content:
            "You are a highly efficient assistant. Summarize the following chat log concisely. Focus on key decisions, important updates, and action items. Do NOT use meta-commentary (e.g., avoid phrases like 'No decisions were made', 'The chat shows', or 'The user inquired about'). Simply state the facts of the conversation directly. Keep it under 4 sentences.",
        },
        {
          role: "user",
          content: chatLog,
        },
      ],
      max_tokens: 150, // Hard limit on the response length to save costs
      temperature: 0.5, // Slightly lower temperature for more focused, analytical output
    });

    const summary = response.choices[0].message.content;

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating channel summary:", error);
    return res.status(500).json({ error: "Failed to generate summary." });
  }
};
