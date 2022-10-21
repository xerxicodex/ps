import { createClient } from "redis";

const redisUrl = `redis://localhost:6379`;
const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("? Redis client connected...");
        redisClient.set(
            "tRPC",
            "Welcome to NXPRPG a nexus pokemon RPG\nCollect, Battle & Trade your favorite pokemon"
        );
    } catch (err: any) {
        console.log(err.message);
        process.exit(1);
    }
};

connectRedis();

redisClient.on("error", (err: any) => console.log(err));

export default redisClient;
