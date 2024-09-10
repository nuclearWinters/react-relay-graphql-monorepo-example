import { RedisPubSub } from "graphql-redis-subscriptions";
import { RedisOptions, Redis } from "ioredis";
import { IOREDIS } from "@lerna-monorepo/backend-utilities/config";

export const options: RedisOptions = {
  host: IOREDIS,
  port: 6379,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export const LOAN_INSERT = "LOAN_INSERT";
export const MY_LOAN_INSERT = "MY_LOAN_INSERT";
export const TRANSACTION_INSERT = "TRANSACTION_INSERT";
export const INVESTMENT_INSERT = "INVESTMENT_INSERT";
export const USER = "USER";
export const INVESTMENT_UPDATE = "INVESTMENT_UPDATE";
export const LOAN_UPDATE = "LOAN_UPDATE";
