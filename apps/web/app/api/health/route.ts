export const dynamic = "force-dynamic";

export function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_BUILD_COMMIT;

  return Response.json(
    {
      ok: true,
      app: "nexa-sunverter-academy",
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.1.0",
      commit: commit ? commit.slice(0, 12) : "local",
      model: "CM3500-24S",
      timestamp: new Date().toISOString()
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
