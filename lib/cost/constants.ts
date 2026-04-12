/**
 * Re-export Prisma enums so callers can import stable symbols from this module.
 */
import {
  ApiType as ApiTypeEnum,
  EventStatus as EventStatusEnum,
  Provider as ProviderEnum,
} from "@prisma/client";

export const Provider = ProviderEnum;
export const ApiType = ApiTypeEnum;
export const EventStatus = EventStatusEnum;

export type Provider = (typeof Provider)[keyof typeof Provider];
export type ApiType = (typeof ApiType)[keyof typeof ApiType];
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
