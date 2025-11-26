import { Redis } from "@upstash/redis";
import doetenv from "dotenv";

doetenv.config();

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_Token,
});
