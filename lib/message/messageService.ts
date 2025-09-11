import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Store message in the DB
export const saveMessage = async (
  chatId: number,
  sender: string,
  message: string,
  reading?: string,
  english?: string
) => {
  return await prisma.message.create({
    data: {
      chatId,
      sender,
      message,
      reading: reading || "",
      english: english || "",
    },
  });
};
