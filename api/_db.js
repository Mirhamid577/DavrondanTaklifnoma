import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "";

export const isDbConfigured = Boolean(connectionString);

const sql = isDbConfigured ? neon(connectionString) : null;

let schemaPromise = null;

/* Jadval bir marta yaratiladi (idempotent) */
function ensureSchema() {
  if (!sql) return Promise.resolve();
  if (!schemaPromise) {
    schemaPromise = sql`
      create table if not exists wishes (
        id bigint generated always as identity primary key,
        name text not null,
        message text not null,
        created_at timestamptz not null default now()
      )
    `.catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

export async function listWishes(limit = 200) {
  await ensureSchema();
  const rows = await sql`
    select id, name, message, created_at
    from wishes
    order by created_at desc, id desc
    limit ${limit}
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function insertWish({ name, message }) {
  await ensureSchema();
  const rows = await sql`
    insert into wishes (name, message)
    values (${name}, ${message})
    returning id, name, message, created_at
  `;
  const row = rows[0];
  return {
    id: String(row.id),
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  };
}
