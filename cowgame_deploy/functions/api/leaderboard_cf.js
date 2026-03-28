const CATEGORIES = ["ach", "level", "fruit", "fish"];
const MAX = 200;

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const KV = env.LEADERBOARD_KV;

    if (request.method === "GET") {
        const cat = CATEGORIES.includes(url.searchParams.get("cat"))
            ? url.searchParams.get("cat") : "level";
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const scores = (await KV.get(cat, { type: "json" })) || [];
        return Response.json({ ok: true, scores: scores.slice(0, limit) });
    }

    if (request.method === "POST") {
        let body;
        try { body = await request.json(); }
        catch { return Response.json({ ok: false }, { status: 400 }); }

        const { cat, value, extra } = body;
        const name = String(body.name || "匿名小牛").slice(0, 10).trim() || "匿名小牛";

        if (!CATEGORIES.includes(cat) || typeof value !== "number" || value < 0)
            return Response.json({ ok: false, error: "invalid" }, { status: 400 });

        const scores = (await KV.get(cat, { type: "json" })) || [];
        const existIdx = scores.findIndex(s => s.name === name);
        const entry = { name, value: Math.floor(value), extra: extra ? String(extra).slice(0, 20) : undefined, time: Date.now() };

        if (existIdx >= 0) {
            if (value > scores[existIdx].value) scores[existIdx] = entry;
            else {
                const rank = scores.findIndex(s => s.name === name) + 1;
                return Response.json({ ok: true, rank, improved: false });
            }
        } else {
            scores.push(entry);
        }

        scores.sort((a, b) => b.value - a.value);
        const trimmed = scores.slice(0, MAX);
        await KV.put(cat, JSON.stringify(trimmed));
        const rank = trimmed.findIndex(s => s.name === name) + 1;
        return Response.json({ ok: true, rank, total: trimmed.length, improved: true });
    }

    return Response.json({ ok: false }, { status: 405 });
}
