import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    const [userCount, postCount] = await Promise.all([
      db.user.count(),
      db.post.count(),
    ]);
    return NextResponse.json({
      ok: true,
      database: "connected",
      counts: { users: userCount, posts: postCount },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json(
      { ok: false, database: "error", message },
      { status: 503 },
    );
  }
}