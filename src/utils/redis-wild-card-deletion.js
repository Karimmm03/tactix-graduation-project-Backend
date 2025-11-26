import { redis } from "../config/redis.config.js";

export async function deleteKeysByPattern(pattern) {
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });
    cursor = nextCursor;

    if (keys.length > 0) {
      await redis.unlink(...keys); // delete batch
      console.log(`Deleted ${keys.length} keys in this batch.`);
    }
  } while (cursor !== "0");

  console.log("Finished deleting all matching keys.");
}
