import { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminAuth } from "../../../middleware/adminMiddleware";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.admin_token;
  const decodedToken = verifyAdminAuth(token);

  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated as admin" });
  }

  try {
    const { userId, chatId } = req.query;

    // If userId is provided, get usage for that user
    if (userId && typeof userId === "string") {
      const userUsage = await getUserUsage(userId);
      return res.status(200).json(userUsage);
    }

    // If chatId is provided, get usage for that chat
    if (chatId && typeof chatId === "string") {
      const chatUsage = await getChatUsage(parseInt(chatId));
      return res.status(200).json(chatUsage);
    }

    // Otherwise, get all users with their usage stats
    const allUsersUsage = await getAllUsersUsage();
    return res.status(200).json(allUsersUsage);
  } catch (error: any) {
    console.error("Admin usage stats error:", error);
    console.error("Error details:", error?.message, error?.stack);
    return res.status(500).json({
      error: "Something went wrong",
      details: error?.message || "Unknown error"
    });
  }
}

async function getUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const usageEvents = await prisma.usageEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalCost = usageEvents.reduce(
    (sum, event) => sum + Number(event.costUsd),
    0
  );

  const totalTokens = usageEvents.reduce(
    (sum, event) =>
      sum + (event.inputTokens || 0) + (event.outputTokens || 0),
    0
  );

  const totalCharacters = usageEvents.reduce(
    (sum, event) => sum + (event.characters || 0),
    0
  );

  // Group by chat
  const chatsUsage = await prisma.chat.findMany({
    where: { userId },
    include: {
      usageEvents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const chatsWithUsage = chatsUsage.map((chat) => {
    const chatEvents = chat.usageEvents;
    const chatCost = chatEvents.reduce(
      (sum, event) => sum + Number(event.costUsd),
      0
    );
    const chatTokens = chatEvents.reduce(
      (sum, event) =>
        sum + (event.inputTokens || 0) + (event.outputTokens || 0),
      0
    );
    const chatCharacters = chatEvents.reduce(
      (sum, event) => sum + (event.characters || 0),
      0
    );

    return {
      chatId: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      costUsd: chatCost,
      totalTokens: chatTokens,
      totalCharacters: chatCharacters,
      eventCount: chatEvents.length,
    };
  });

  return {
    user,
    summary: {
      totalCostUsd: totalCost,
      totalTokens,
      totalCharacters,
      totalEvents: usageEvents.length,
    },
    chats: chatsWithUsage,
    events: usageEvents.slice(0, 100), // Limit to last 100 events
  };
}

async function getChatUsage(chatId: number) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
      usageEvents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  const totalCost = chat.usageEvents.reduce(
    (sum, event) => sum + Number(event.costUsd),
    0
  );

  const totalTokens = chat.usageEvents.reduce(
    (sum, event) =>
      sum + (event.inputTokens || 0) + (event.outputTokens || 0),
    0
  );

  const totalCharacters = chat.usageEvents.reduce(
    (sum, event) => sum + (event.characters || 0),
    0
  );

  return {
    chat: {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      user: chat.user,
    },
    summary: {
      totalCostUsd: totalCost,
      totalTokens,
      totalCharacters,
      totalEvents: chat.usageEvents.length,
    },
    events: chat.usageEvents,
  };
}

async function getAllUsersUsage() {
  // First check if UsageEvent table exists and has any data
  const usageEventCount = await prisma.usageEvent.count().catch(() => 0);
  console.log("Total usage events in database:", usageEventCount);

  // Get all users with their usage stats
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get usage stats for each user
  const usersWithUsage = await Promise.all(
    users.map(async (user) => {
      const usageEvents = await prisma.usageEvent.findMany({
        where: { userId: user.id },
      }).catch((err) => {
        console.error(`Error fetching usage events for user ${user.id}:`, err);
        return [];
      });

      const totalCost = usageEvents.reduce(
        (sum, event) => sum + Number(event.costUsd),
        0
      );

      const totalTokens = usageEvents.reduce(
        (sum, event) =>
          sum + (event.inputTokens || 0) + (event.outputTokens || 0),
        0
      );

      const totalCharacters = usageEvents.reduce(
        (sum, event) => sum + (event.characters || 0),
        0
      );

      // Get chat count with usage
      const chatsWithUsage = await prisma.chat.findMany({
        where: { userId: user.id },
        include: {
          usageEvents: {
            select: {
              id: true,
            },
          },
        },
      });

      const chatsWithUsageCount = chatsWithUsage.filter(
        (chat) => chat.usageEvents.length > 0
      ).length;

      return {
        ...user,
        usage: {
          totalCostUsd: totalCost,
          totalTokens,
          totalCharacters,
          totalEvents: usageEvents.length,
          chatsWithUsage: chatsWithUsageCount,
        },
      };
    })
  );

  // Calculate totals
  const totals = usersWithUsage.reduce(
    (acc, user) => ({
      totalCostUsd: acc.totalCostUsd + user.usage.totalCostUsd,
      totalTokens: acc.totalTokens + user.usage.totalTokens,
      totalCharacters: acc.totalCharacters + user.usage.totalCharacters,
      totalEvents: acc.totalEvents + user.usage.totalEvents,
    }),
    {
      totalCostUsd: 0,
      totalTokens: 0,
      totalCharacters: 0,
      totalEvents: 0,
    }
  );

  console.log(`Returning usage data for ${usersWithUsage.length} users`);
  console.log(`Total cost: ${totals.totalCostUsd}, Total tokens: ${totals.totalTokens}, Total events: ${totals.totalEvents}`);

  return {
    users: usersWithUsage,
    totals,
  };
}
