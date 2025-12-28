-- AlterTable: Add CASCADE delete to Chat.userId foreign key
-- This ensures that when a User is deleted, all their Chats (and related data) are automatically deleted

-- First, drop the existing foreign key constraint
ALTER TABLE "Chat" DROP CONSTRAINT IF EXISTS "Chat_userId_fkey";

-- Re-add the foreign key constraint with CASCADE delete
ALTER TABLE "Chat"
ADD CONSTRAINT "Chat_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
