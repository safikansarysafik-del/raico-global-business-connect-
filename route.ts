import { NextRequest, NextResponse } from "next/server";

// Runs on the Node.js runtime (required for the Cloudflare/OpenNext deployment
// path below — do not change this to "edge").
export const runtime = "nodejs";

const ANTHROPIC_MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  let body: { text?: string; sourceLangName?: string; targetLangName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { text, sourceLangName, targetLangName } = body;
  if (!text || !targetLangName) {
    return NextResponse.json({ error: "Missing required fields: text, targetLangName" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fail soft so the app stays usable before a key is configured —
    // the chat still works, it just shows the original text.
    return NextResponse.json({
      translated: text,
      warning: "ANTHROPIC_API_KEY is not configured on the server. Set it in your environment to enable live translation.",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a translation engine inside a B2B trade chat app. Translate the message below from ${sourceLangName || "the sender's language"} to ${targetLangName}. Preserve business tone and any numbers, prices, or product names exactly. Reply with ONLY the translated text and nothing else — no quotes, no explanation.\n\nMessage: ${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error", response.status, errText);
      return NextResponse.json({ translated: text, error: `Translation provider returned ${response.status}` }, { status: 200 });
    }

    const data = await response.json();
    const translated = (data.content || [])
      .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text ?? "" : ""))
      .join("")
      .trim();

    return NextResponse.json({ translated: translated || text });
  } catch (err) {
    console.error("Translation request failed", err);
    return NextResponse.json({ translated: text, error: "Translation request failed" }, { status: 200 });
  }
}
