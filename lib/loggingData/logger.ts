import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "token.json");

export const logUsage = (entry: any) => {
  const { chatId, ...rest } = entry;

  if (!chatId) {
    console.error("No chatId provided in logUsage");
    return;
  }

  let data: { chats: Record<string, any[]> } = { chats: {} };

  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf-8").trim();
      if (raw) {
        data = JSON.parse(raw);
      }
    }
  } catch (err) {
    console.error("Failed to parse token.json, initializing new file.", err);
    data = { chats: {} };
  }

  // Ensure chats object exists
  if (!data) data = { chats: {} };
  if (!data.chats) data.chats = {};

  // Ensure array for this chatId exists
  if (!data.chats[chatId]) {
    data.chats[chatId] = [];
  }

  data.chats[chatId].push(rest);

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};
