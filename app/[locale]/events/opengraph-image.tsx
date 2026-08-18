import { ImageResponse } from "next/og";
import Redis from "ioredis";
import { parseRomeLocalDate } from "@/lib/event-date";

// Niente `runtime = "edge"` qui (a differenza dell'opengraph-image generica):
// ioredis usa socket TCP, non supportati su Edge Runtime. Nodejs è il default
// quando `runtime` non è dichiarato.
export const alt = "NightKids — Prossimo Raduno";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const getRedis = () => {
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) return null;
    return new Redis(redisUrl);
};

export default async function Image() {
    let titleStr = "NightKids Turin Car Meet";
    let locationStr = "Porte di Moncalieri, Torino";
    let dateStr = "";

    const redis = getRedis();
    if (redis) {
        try {
            const [fetchedTitle, fetchedLoc, fetchedDate] = await Promise.all([
                redis.get("nightkids_event_title"),
                redis.get("nightkids_event_location"),
                redis.get("nightkids_event_date"),
            ]);
            if (fetchedTitle) titleStr = fetchedTitle;
            if (fetchedLoc) locationStr = fetchedLoc;
            if (fetchedDate) {
                dateStr = parseRomeLocalDate(fetchedDate).toLocaleDateString("it-IT", {
                    timeZone: "Europe/Rome",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
            }
        } catch (e) {
            console.error("[OG IMAGE EVENTS] Redis fetch failed", e);
        } finally {
            redis.quit();
        }
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000000",
                    backgroundImage:
                        "radial-gradient(circle at 50% 40%, rgba(220,38,38,0.35), rgba(0,0,0,0) 60%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 30,
                        fontWeight: 700,
                        letterSpacing: 10,
                        textTransform: "uppercase",
                        color: "#dc2626",
                        marginBottom: 24,
                    }}
                >
                    NightKids Raduno
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 76,
                        fontWeight: 900,
                        fontStyle: "italic",
                        letterSpacing: -2,
                        textTransform: "uppercase",
                        color: "white",
                        textAlign: "center",
                        maxWidth: 1000,
                        justifyContent: "center",
                    }}
                >
                    {titleStr}
                </div>
                {dateStr ? (
                    <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#e5e5e5" }}>
                        {dateStr}
                    </div>
                ) : null}
                <div style={{ display: "flex", marginTop: 12, fontSize: 26, letterSpacing: 2, color: "#9ca3af" }}>
                    {locationStr}
                </div>
            </div>
        ),
        { ...size }
    );
}
