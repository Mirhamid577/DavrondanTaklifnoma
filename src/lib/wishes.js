/*
 * Tilaklarni umumiy saqlash: /api/wishes (Vercel serverless funksiya).
 * Baza (DATABASE_URL) hali ulanmagan bo'lsa, API `enabled: false`
 * qaytaradi va sayt avvalgidek ishlaydi — tilaklar faqat brauzerda.
 */

const API_URL = "/api/wishes";

/* Serverdan bir marta yuklanadigan eng so'nggi tilaklar soni */
export const WISHES_LIMIT = 200;

async function request(method, body) {
  const res = await fetch(API_URL, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 503 || data.enabled === false) {
    return { enabled: false };
  }

  if (!res.ok) {
    throw new Error(data.error || `request_failed_${res.status}`);
  }

  return { enabled: true, ...data };
}

/* Ro'yxatni yuklash: { enabled, wishes } */
export async function fetchWishes() {
  const data = await request("GET");
  return {
    enabled: Boolean(data.enabled),
    wishes: Array.isArray(data.wishes) ? data.wishes : [],
  };
}

/* Yangi tilak qo'shish: saqlangan yozuv yoki null */
export async function createWish({ name, message }) {
  const data = await request("POST", { name, message });
  return data.enabled && data.wish ? data.wish : null;
}
