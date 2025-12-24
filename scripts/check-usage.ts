import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsage() {
  try {
    // Count total usage events
    const totalEvents = await prisma.usageEvent.count();
    console.log(`\n📊 Total Usage Events: ${totalEvents}\n`);

    if (totalEvents === 0) {
      console.log("⚠️  No usage events found. Usage tracking was just enabled.");
      console.log("   Create a new chat and send messages to generate usage data.\n");
      return;
    }

    // Get all usage events with user and chat info
    const events = await prisma.usageEvent.findMany({
      take: 20, // Limit to first 20
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
        chat: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    console.log("📋 Recent Usage Events (last 20):\n");
    console.log("─".repeat(100));

    events.forEach((event, index) => {
      console.log(`\n${index + 1}. Event ID: ${event.id}`);
      console.log(`   User: ${event.user.email} (${event.user.username || "No username"})`);
      console.log(`   Chat: ${event.chat?.title || `Chat #${event.chatId}` || "N/A"}`);
      console.log(`   Provider: ${event.provider}`);
      console.log(`   API Type: ${event.apiType}`);
      console.log(`   Status: ${event.status}`);

      if (event.inputTokens || event.outputTokens) {
        console.log(`   Tokens: ${event.inputTokens || 0} input + ${event.outputTokens || 0} output = ${(event.inputTokens || 0) + (event.outputTokens || 0)} total`);
      }

      if (event.characters) {
        console.log(`   Characters: ${event.characters}`);
      }

      console.log(`   Cost: $${Number(event.costUsd).toFixed(6)}`);
      console.log(`   Created: ${event.createdAt.toLocaleString()}`);
      console.log("─".repeat(100));
    });

    // Get summary stats
    const allEvents = await prisma.usageEvent.findMany();

    const totalCost = allEvents.reduce((sum, e) => sum + Number(e.costUsd), 0);
    const totalTokens = allEvents.reduce(
      (sum, e) => sum + (e.inputTokens || 0) + (e.outputTokens || 0),
      0
    );
    const totalCharacters = allEvents.reduce((sum, e) => sum + (e.characters || 0), 0);

    console.log("\n💰 Summary Statistics:\n");
    console.log(`   Total Cost: $${totalCost.toFixed(4)}`);
    console.log(`   Total Tokens: ${totalTokens.toLocaleString()}`);
    console.log(`   Total Characters: ${totalCharacters.toLocaleString()}`);
    console.log(`   Total Events: ${allEvents.length}\n`);

    // Group by user
    const userStats = await prisma.user.findMany({
      include: {
        usageEvents: true,
      },
    });

    console.log("👥 Usage by User:\n");
    userStats.forEach((user) => {
      if (user.usageEvents.length > 0) {
        const userCost = user.usageEvents.reduce(
          (sum, e) => sum + Number(e.costUsd),
          0
        );
        const userTokens = user.usageEvents.reduce(
          (sum, e) => sum + (e.inputTokens || 0) + (e.outputTokens || 0),
          0
        );
        console.log(`   ${user.email}:`);
        console.log(`     Events: ${user.usageEvents.length}`);
        console.log(`     Cost: $${userCost.toFixed(4)}`);
        console.log(`     Tokens: ${userTokens.toLocaleString()}\n`);
      }
    });

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("usageEvent")) {
      console.error("\n⚠️  The UsageEvent model might not be available.");
      console.error("   Try running: npx prisma generate\n");
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkUsage();
