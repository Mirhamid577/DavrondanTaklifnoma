import { insertWish, isDbConfigured, listWishes } from "./_db.js";

const MAX_NAME = 100;
const MAX_MESSAGE = 500;

/* Oddiy spam himoyasi: bir IP dan daqiqasiga 6 ta tilak */
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60 * 1000;
const recentWrites = new Map();

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const hits = (recentWrites.get(ip) || []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );
  if (hits.length >= RATE_LIMIT) {
    recentWrites.set(ip, hits);
    return true;
  }
  hits.push(now);
  recentWrites.set(ip, hits);
  if (recentWrites.size > 5000) recentWrites.clear();
  return false;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  const method = req.method || "GET";

  if (!isDbConfigured) {
    /* Baza hali ulanmagan — sayt ishlashda davom etadi,
     * tilaklar faqat brauzer xotirasida qoladi. */
    return send(res, 200, method === "POST"
      ? { enabled: false, wish: null }
      : { enabled: false, wishes: [] });
  }

  if (method === "GET") {
    try {
      const wishes = await listWishes();
      return send(res, 200, { enabled: true, wishes });
    } catch {
      return send(res, 500, { enabled: true, error: "load_failed" });
    }
  }

  if (method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "method_not_allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "";

  if (isRateLimited(ip)) {
    return send(res, 429, { enabled: true, error: "too_many_requests" });
  }

  const body = await readJsonBody(req);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !message || name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return send(res, 400, { enabled: true, error: "invalid_input" });
  }

  try {
    const wish = await insertWish({ name, message });
    return send(res, 201, { enabled: true, wish });
  } catch {
    return send(res, 500, { enabled: true, error: "save_failed" });
  }
}
