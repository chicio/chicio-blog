import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const getValueFor = async <T>(key: string): Promise<T | null> => {
    const value = await redis.get<T>(key);
    return value
}

export const setValueFor = async <T>(key: string, value: T, expirationSeconds?: number): Promise<void> => {
    if (expirationSeconds) {
        await redis.set(key, value, { ex: expirationSeconds });
    } else {
        await redis.set(key, value);
    }   
}

export const setExpirationFor = async (key: string, expirationSeconds: number): Promise<void> => {
    await redis.expire(key, expirationSeconds);
}

export const incrementValueByOneFor = async (key: string): Promise<number> => {
    const newValue = await redis.incr(key);
    return newValue;
}
