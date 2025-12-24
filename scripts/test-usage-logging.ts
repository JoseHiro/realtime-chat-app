import { PrismaClient } from "@prisma/client";
import { logOpenAIEvent, logTTSEvent } from "../lib/cost/logUsageEvent";
import { ApiType, Provider } from "../lib/cost/constants";

const prisma = new PrismaClient();

async function testUsageLogging() {
  try {
    // Get the first user
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log("❌ No users found. Please create a user first.");
      return;
    }

    console.log(`\n🧪 Testing usage logging for user: ${user.email}\n`);

    // Get or create a test chat
    let chat = await prisma.chat.findFirst({
      where: { userId: user.id },
    });

    if (!chat) {
      console.log("Creating a test chat...");
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: "Test Chat for Usage Tracking",
          theme: "daily",
          politeness: "casual",
          level: "easy",
        },
      });
    }

    console.log(`Using chat ID: ${chat.id}\n`);

    // Test OpenAI event logging
    console.log("1. Testing OpenAI event logging...");
    await logOpenAIEvent({
      userId: user.id,
      chatId: chat.id,
      apiType: ApiType.CHAT,
      model: "gpt-4o-mini",
      inputTokens: 100,
      outputTokens: 50,
      messageCount: 1,
    });
    console.log("✅ OpenAI event logged\n");

    // Test TTS event logging
    console.log("2. Testing TTS event logging...");
    await logTTSEvent({
      userId: user.id,
      chatId: chat.id,
      provider: "AZURE",
      voice: "ja-JP-NanamiNeural",
      characters: 50,
    });
    console.log("✅ TTS event logged\n");

    // Verify events were created
    const events = await prisma.usageEvent.findMany({
      where: {
        userId: user.id,
        chatId: chat.id,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log(`\n📊 Found ${events.length} usage events for this chat:\n`);
    events.forEach((event, i) => {
      console.log(`${i + 1}. ${event.provider} - ${event.apiType}`);
      console.log(`   Cost: $${Number(event.costUsd).toFixed(6)}`);
      console.log(`   Created: ${event.createdAt.toLocaleString()}\n`);
    });

    console.log("✅ Test completed successfully!\n");

  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    console.error("Error details:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsageLogging();
