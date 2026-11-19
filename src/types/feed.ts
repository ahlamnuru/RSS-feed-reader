const MAX_BYTES = 3_000_000;

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }

  if (host === "::1" || host.startsWith("[")) {
    return true;
  }

  const parts = host.split(".").map(Number);

  if (parts.length === 4 && parts.every((n) => Number.isInteger(n))) {
    const [a, b] = parts;
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  return false;
}

export async function GET(request: Request): Promise<Response> {
  const target = new URL(request.url).searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let parsed: URL;

  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new Response("Invalid protocol", { status: 400 });
  }

  if (isPrivateHost(parsed.hostname)) {
    return new Response("Host not allowed", { status: 400 });
  }

  try {
    const upstream = await fetch(parsed, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; FrontpageReader/1.0)",
        accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(10000),
    });

    const body = await upstream.text();

    if (body.length > MAX_BYTES) {
      return new Response("Feed too large", { status: 413 });
    }

    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": "text/xml; charset=utf-8",
        "cache-control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return new Response("Unable to fetch feed", { status: 502 });
  }
}