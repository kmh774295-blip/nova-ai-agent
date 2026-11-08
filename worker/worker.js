// Nova AI Telegram Bot — Cloudflare Worker (Phase 4)
// No secrets in this file. Set these in the Cloudflare dashboard
// (Worker → Settings → Variables → Add variable, mark as secret):
//   TELEGRAM_BOT_TOKEN — from @BotFather
//   GROQ_API_KEY       — Groq console (free tier); same key as the
//                        dashboard chat, or a second key named "Nova-Bot"
const TELEGRAM_API = "https://api.telegram.org";
const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

async function sendMessage(env, chatId, text) {
  const res = await fetch(`${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: String(text).slice(0, 4000) }),
  });
  return res.json();
}

async function groqReply(env, text) {
  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "তুমি Nova AI — একজন বন্ধুসুলভ পার্সোনাল AI সহকারী (টেলিগ্রাম বট)। ব্যবহারকারী যে ভাষায় লিখবে (বাংলা বা ইংরেজি), সেই ভাষায় উত্তর দাও। সংক্ষিপ্ত ও সহজ ভাষায় উত্তর দাও।",
        },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });
  if (!res.ok) throw new Error("Groq " + res.status);
  const data = await res.json();
  const out = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!out) throw new Error("empty reply");
  return out.trim();
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Nova AI bot is running", { status: 200 });
    }
    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("bad request", { status: 400 });
    }
    const msg = update.message;
    if (!msg || !msg.text) return new Response("ok", { status: 200 });
    const chatId = msg.chat.id;
    const text = msg.text.trim();
    try {
      let reply;
      if (text === "/start") {
        reply =
          "আসসালামু আলাইকুম! আমি Nova AI 👋\nআমাকে যেকোনো প্রশ্ন করো — বাংলা বা ইংরেজিতে।";
      } else {
        reply = await groqReply(env, text);
      }
      await sendMessage(env, chatId, reply);
    } catch (e) {
      // Include the error detail so a failed Groq call can be diagnosed
      // from the bot's reply (e.g. "Groq 401" = bad key, "Groq 400" =
      // bad model/request, "Groq 429" = rate limit).
      await sendMessage(
        env,
        chatId,
        "⚠️ দুঃখিত, এখন উত্তর দিতে পারছি না — একটু পরে আবার চেষ্টা করো। (" + e.message + ")"
      );
    }
    return new Response("ok", { status: 200 });
  },
};
