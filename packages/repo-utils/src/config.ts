export const MONGO_DB = process.env.MONGO_DB || "mongodb://mongo-fintech:27017";
export const REFRESHSECRET = process.env.REFRESHSECRET || "REFRESHSECRET";
export const ACCESSSECRET = process.env.ACCESSSECRET || "ACCESSSECRET";
export const REDIS = process.env.REDIS || "redis://redis-fintech:6379";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const REFRESH_TOKEN_EXP_NUMBER = 900;
export const ACCESS_TOKEN_EXP_NUMBER = 180;
export const KAFKA = process.env.KAFKA || "kafka:9092";
export const KAFKA_ID = process.env.KAFKA_ID || "my-app";
export const GRPC_AUTH = process.env.GRPC_AUTH || "grpc-auth-node:4003";
export const GRPC_FINTECH =
  process.env.GRPC_FINTECH || "grpc-fintech-node:4001";
export const KAFKA_USERNAME = process.env.KAFKA_USERNAME || "";
export const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD || "";
export const IS_PRODUCTION = NODE_ENV === "production";
