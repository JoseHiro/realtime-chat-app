# Credit System Database Schema

## Overview

This document outlines the database schema changes needed to implement the credit-based pricing system.

## Credit Allocation

- **Pro Plan**: 280 credits/month ($15/month)
- **Premium Plan**: 480 credits/month ($20/month)

## Credit Cost Per Conversation

- 3min + Azure: **4 credits**
- 3min + ElevenLabs: **5 credits**
- 5min + Azure: **7 credits**
- 5min + ElevenLabs: **9 credits**
- 10min + Azure: **11 credits** (future)
- 10min + ElevenLabs: **14 credits** (future)

---

## Schema Changes Required

### 1. User Model Updates

**Add these fields to the `User` model:**

```prisma
model User {
  // ... existing fields ...

  // Credit system fields
  creditsRemaining    Int      @default(0)  // Current credit balance
  lastCreditResetAt   DateTime?             // When credits were last reset (null = never reset)
  creditTransactions  CreditTransaction[]   // Transaction history
}
```

**Fields:**

- `creditsRemaining`: Current credit balance (starts at 0, gets allocated on subscription)
- `lastCreditResetAt`: Tracks when monthly credits were last allocated/reset

---

### 2. Chat Model Updates

**Add these fields to the `Chat` model:**

```prisma
model Chat {
  // ... existing fields ...

  voiceProvider    String?  // "azure" or "elevenlabs"
  creditsUsed      Int?     // How many credits this chat cost
  creditTransactionId Int?  // Link to credit transaction
  creditTransaction CreditTransaction? @relation(fields: [creditTransactionId], references: [id])
}
```

**Fields:**

- `voiceProvider`: Which TTS provider was used ("azure" or "elevenlabs")
- `creditsUsed`: Number of credits deducted for this chat
- `creditTransactionId`: Links to the transaction record (for auditing)

---

### 3. New CreditTransaction Model

**Create a new model for credit transaction history:**

```prisma
enum CreditTransactionType {
  ALLOCATION    // Monthly credit allocation (subscription renewal)
  USAGE         // Credit deduction for chat usage
  TOPUP         // Manual credit purchase/add-on
  REFUND        // Credit refund
  ADJUSTMENT    // Admin adjustment
}

model CreditTransaction {
  id          Int       @id @default(autoincrement())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  chatId      Int?      // Null for non-usage transactions
  chat        Chat?     @relation(fields: [chatId], references: [id], onDelete: SetNull)
  type        CreditTransactionType
  amount      Int       // Positive for additions, negative for deductions
  balanceAfter Int      // Credit balance after this transaction
  description String?   // Optional description/admin note
  createdAt   DateTime  @default(now())

  @@index([userId, createdAt])
  @@index([chatId])
  @@index([type])
  @@index([createdAt])
}
```

**Purpose:**

- Complete audit trail of all credit movements
- Can query user's credit history
- Can verify credits were properly deducted
- Supports admin adjustments and refunds

---

## Complete Schema Snippet

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  username String?
  password  String
  chats     Chat[]
  createdAt DateTime @default(now())
  isAdmin   Boolean  @default(false)
  usageEvents UsageEvent[]
  creditTransactions CreditTransaction[]

  // Stripe-related fields
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  subscriptionStatus   String?   // e.g. "trialing", "active", "canceled", "past_due"
  subscriptionPlan     String?   // e.g. "free", "trial", "pro", "premium"
  trialUsedChats   Int　@default(0)
  trialEndsAt DateTime?  // null if no trial

  // Credit system fields
  creditsRemaining    Int      @default(0)
  lastCreditResetAt   DateTime?
}

model Chat {
  id       Int      @id @default(autoincrement())
  user     User      @relation(fields: [userId], references: [id])
  userId   String
  title    String?
  message  Message[]
  theme    String?
  politeness String?
  level    String?
  characterName String? // e.g. "Sakura" (female) or "Ken" (male)
  time     Int?      // Duration in minutes (3, 5, 10)
  createdAt DateTime @default(now())
  analysis   Analysis?
  usageEvents UsageEvent[]
  creditTransaction CreditTransaction?

  // Credit system fields
  voiceProvider    String?  // "azure" or "elevenlabs"
  creditsUsed      Int?
  creditTransactionId Int?  @unique
}

enum CreditTransactionType {
  ALLOCATION
  USAGE
  TOPUP
  REFUND
  ADJUSTMENT
}

model CreditTransaction {
  id          Int       @id @default(autoincrement())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  chatId      Int?
  chat        Chat?     @relation(fields: [chatId], references: [id], onDelete: SetNull)
  type        CreditTransactionType
  amount      Int       // Positive for additions, negative for deductions
  balanceAfter Int      // Credit balance after this transaction
  description String?
  createdAt   DateTime  @default(now())

  @@index([userId, createdAt])
  @@index([chatId])
  @@index([type])
  @@index([createdAt])
}
```

---

## Helper Functions Needed

### Calculate Credits Based on Settings

```typescript
// lib/credits/calculateCredits.ts
export function calculateCreditsForChat(
  durationMinutes: number,
  voiceProvider: "azure" | "elevenlabs"
): number {
  const creditMap: Record<string, Record<number, number>> = {
    azure: {
      3: 4,
      5: 7,
      10: 11, // future
    },
    elevenlabs: {
      3: 5,
      5: 9,
      10: 14, // future
    },
  };

  const credits = creditMap[voiceProvider]?.[durationMinutes];
  if (!credits) {
    throw new Error(
      `Invalid combination: ${durationMinutes}min + ${voiceProvider}`
    );
  }

  return credits;
}
```

### Get Monthly Credit Allocation

```typescript
// lib/credits/allocations.ts
export function getMonthlyCreditAllocation(plan: string | null): number {
  switch (plan) {
    case "pro":
      return 280;
    case "premium":
      return 480;
    default:
      return 0; // Free/trial users
  }
}
```

---

## Migration Strategy

1. **Add fields to existing models** (User, Chat)
2. **Create new CreditTransaction model**
3. **Backfill existing data:**

   - Set `creditsRemaining = 0` for all users
   - Set `lastCreditResetAt = null` for all users
   - Existing chats: `voiceProvider = "azure"` (assume default), `creditsUsed = null`

4. **On subscription activation/renewal:**

   - Check if it's a new month (compare `lastCreditResetAt` with current date)
   - If new month: allocate credits based on plan
   - Update `creditsRemaining` and `lastCreditResetAt`
   - Create `CreditTransaction` with type `ALLOCATION`

5. **On chat creation:**
   - Calculate credits based on `time` + `voiceProvider`
   - Check if user has enough credits
   - Deduct credits from `creditsRemaining`
   - Store `creditsUsed` and `voiceProvider` in Chat
   - Create `CreditTransaction` with type `USAGE`

---

## API Endpoints Needed

1. **GET `/api/user/credits`** - Get current credit balance
2. **POST `/api/credits/allocate`** - Manual credit allocation (admin/internal)
3. **GET `/api/credits/transactions`** - Get credit transaction history
4. **POST `/api/credits/topup`** - Purchase additional credits (future)

---

## Summary

**Tables to modify:**

- ✅ User (add 2 fields)
- ✅ Chat (add 3 fields)

**Tables to create:**

- ✅ CreditTransaction (new model)

**Total: 1 new table, 2 existing tables modified**
