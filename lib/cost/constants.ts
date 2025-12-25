/**
 * Re-export Prisma enums to avoid TypeScript import issues
 * This file ensures the enums are properly accessible
 */

// Using require to bypass TypeScript module resolution issues
// Prisma enums are exported as const objects
const prismaClient = require("@prisma/client");

// Export enum const objects for runtime values
export const Provider = prismaClient.Provider;
export const ApiType = prismaClient.ApiType;
export const EventStatus = prismaClient.EventStatus;

// Export types
export type Provider = typeof Provider[keyof typeof Provider];
export type ApiType = typeof ApiType[keyof typeof ApiType];
export type EventStatus = typeof EventStatus[keyof typeof EventStatus];
