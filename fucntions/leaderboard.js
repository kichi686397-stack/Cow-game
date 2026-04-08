const CATEGORIES = ["ach", "level", "fruit", "fish"];
const MAX = 200;
const DEFAULT_CATEGORY = "level";
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const badRequest = (error) => Response.json({ ok: false, error }, { status: 400 });

function normalizeCategory(cat) {
    return CATEGORIES.includes(cat) ? cat : DEFAULT_CATEGORY;
}

function normalizeLimit(rawLimit) {
    const parsed = Number.parseInt(rawLimit ?? `${DEFAULT_LIMIT}`, 10);
    const safeLimit = Number.isNaN(parsed) ? DEFAULT_LIMIT : parsed;
    return Math.min(safeLimit, MAX_LIMIT);
}

function normalizeEntry({ cat, value, extra, name }) {
    return {
        cat,
        value: Math.floor(value),
        extra: extra ? String(extra).slice(0, 20) : undefined,
        name: String(name || "匿名小牛").slice(0, 10).trim() || "匿名小牛",
        time: Date.now(),
    };
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const KV = env.LEADERBOARD_KV;

    if (!KV) {
        return Response.json({ ok: false, error: "KV not configured" }, { status: 500 });
    }

    if (request.method === "GET") {
        const cat = normalizeCategory(url.searchParams.get("cat"));
        const limit = normalizeLimit(url.searchParams.get("limit"));
        const scores = (await KV.get(cat, { type: "json" })) || [];
        return Response.json({ ok: true, scores: scores.slice(0, limit) });
    }

    if (request.method === "POST") {
        let body;
        try {
            body = await request.json();
        } catch {
            return badRequest("bad json");
        }

        const entry = normalizeEntry(body);
        if (!CATEGORIES.includes(entry.cat) || typeof body.value !== "number" || body.value < 0) {
            return badRequest("invalid");
        }

        const scores = (await KV.get(entry.cat, { type: "json" })) || [];
        const existingIndex = scores.findIndex((score) => score.name === entry.name);

        if (existingIndex >= 0) {
            if (entry.value > scores[existingIndex].value) {
                scores[existingIndex] = entry;
            } else {
                const rank = existingIndex + 1;
                return Response.json({ ok: true, rank, improved: false });
            }
        } else {
            scores.push(entry);
        }

        scores.sort((a, b) => b.value - a.value);
        const trimmed = scores.slice(0, MAX);
        await KV.put(entry.cat, JSON.stringify(trimmed));
        const rank = trimmed.findIndex((score) => score.name === entry.name) + 1;
        return Response.json({ ok: true, rank, total: trimmed.length, improved: true });
    }

    return Response.json({ ok: false }, { status: 405 });
}
