import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveMessage = async (
  chatId: number,
  sender: string,
  message: string
) => {
  return await prisma.message.create({
    data: {
      chatId,
      sender,
      message,
    },
  });
};
