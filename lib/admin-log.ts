import Redis from 'ioredis';

const getRedis = () => {
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) return null;
    return new Redis(redisUrl);
};

const LOG_KEY = 'nightkids_admin_log';
const MAX_ENTRIES = 50;

export type AdminLogEntry = { message: string; timestamp: string };

// Registra un'azione nel changelog del pannello admin. Best-effort: non deve
// mai far fallire l'azione principale se il logging va storto.
export async function logAdminAction(message: string) {
    const redis = getRedis();
    if (!redis) return;

    try {
        const entry: AdminLogEntry = { message, timestamp: new Date().toISOString() };
        await redis.lpush(LOG_KEY, JSON.stringify(entry));
        await redis.ltrim(LOG_KEY, 0, MAX_ENTRIES - 1);
    } catch (error) {
        console.error("[ADMIN LOG EXCEPTION]", error);
    } finally {
        redis.quit();
    }
}

export async function getAdminLog(): Promise<AdminLogEntry[]> {
    const redis = getRedis();
    if (!redis) return [];

    try {
        const raw = await redis.lrange(LOG_KEY, 0, MAX_ENTRIES - 1);
        return raw.map((r) => JSON.parse(r));
    } catch (error) {
        console.error("[ADMIN LOG FETCH EXCEPTION]", error);
        return [];
    } finally {
        redis.quit();
    }
}
