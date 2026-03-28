import { getStore } from "@netlify/blobs";

const STORE = "lb-v2";
const MAX = 200;
const CATEGORIES = ["ach", "level", "fruit", "fish"];

async function readCat(store, cat) {
    try {
        const data = await store.get(cat, { type: "json" });
        return data || [];
    } catch {
        return [];
    }
}

export default async function handler(req) {
    // getStore 正确调用方式：第一个参数是 name，第二个是 options
    const store = getStore("lb-v2", { consistency: "strong" });
    const url = new URL(req.url);

    if (req.method === "GET") {
        const cat = CATEGORIES.includes(url.searchParams.get("cat"))
            ? url.searchParams.get("cat") : "level";
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const scores = await readCat(store, cat);
        return Response.json({ ok: true, scores: scores.slice(0, limit) });
    }

    if (req.method === "POST") {
        let body;
        try { body = await req.json(); }
        catch { return Response.json({ ok: false, error: "bad json" }, { status: 400 }); }

        const { cat, value, extra } = body;
        const name = String(body.name || "匿名小牛").slice(0, 10).trim() || "匿名小牛";

        if (!CATEGORIES.includes(cat) || typeof value !== "number" || value < 0)
            return Response.json({ ok: false, error: "invalid" }, { status: 400 });

        const scores = await readCat(store, cat);
        const existIdx = scores.findIndex(s => s.name === name);
        const entry = {
            name,
            value: Math.floor(value),
            extra: extra ? String(extra).slice(0, 20) : undefined,
            time: Date.now()
        };

        if (existIdx >= 0) {
            if (value > scores[existIdx].value) {
                scores[existIdx] = entry;
            } else {
                const rank = scores.findIndex(s => s.name === name) + 1;
                return Response.json({ ok: true, rank, improved: false });
            }
        } else {
            scores.push(entry);
        }

        scores.sort((a, b) => b.value - a.value);
        const trimmed = scores.slice(0, MAX);
        await store.setJSON(cat, trimmed);

        const rank = trimmed.findIndex(s => s.name === name) + 1;
        return Response.json({ ok: true, rank, total: trimmed.length, improved: true });
    }

    return Response.json({ ok: false }, { status: 405 });
}

export const config = { path: "/api/leaderboard" };
