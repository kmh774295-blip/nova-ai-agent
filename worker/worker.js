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

async function sendPhoto(env, chatId, blob, caption) {
  const fd = new FormData();
  fd.append("chat_id", String(chatId));
  fd.append("photo", blob, "nova-image.jpg");
  fd.append("caption", String(caption).slice(0, 1000));
  const res = await fetch(`${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: "POST", body: fd });
  return res.json();
}

async function sendImage(env, chatId, prompt) {
  if (!prompt) {
    await sendMessage(env, chatId, "কীসের ছবি বানাবো? এভাবে লিখো: /image a mosque at sunset");
    return;
  }
  const img = await fetch("https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) + "?width=1024&height=1024&model=flux&nologo=true");
  if (!img.ok) throw new Error("Image " + img.status);
  await sendPhoto(env, chatId, await img.blob(), "🖼️ " + prompt);
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
          "আসসালামু আলাইকুম! আমি Nova AI 👋\nআমাকে যেকোনো প্রশ্ন করো — বাংলা বা ইংরেজিতে।\nছবি বানাতে লিখো: /image <বর্ণনা> — যেমন: /image a mosque at sunset";
      } else if (/^(?:\/image)\s+(.+)/i.test(text)) {
        // /image <prompt> — prompt used as-is (English works best).
        const prompt = text.replace(/^(?:\/image)\s+/i, "").trim();
        await sendImage(env, chatId, prompt);
        return new Response("ok", { status: 200 });
      } else if (/ছবি/.test(text) && /(বানাও|তৈরি|আঁক|দাও|চাই|বানিয়ে)/.test(text)) {
        // Bengali image request, e.g. "একটা মসজিদের ছবি তৈরি করে দাও" —
        // Groq extracts a short English prompt from the whole message.
        const prompt = await groqReply(env, "Extract a short English image-generation prompt from this request. Reply with only the prompt, nothing else: " + text);
        await sendImage(env, chatId, prompt.trim());
        return new Response("ok", { status: 200 });
      } else if (/\b(image|picture|photo)\b/i.test(text) && /(generate|make|create|draw|show|give)/i.test(text)) {
        const prompt = await groqReply(env, "Extract a short English image-generation prompt from this request. Reply with only the prompt, nothing else: " + text);
        await sendImage(env, chatId, prompt.trim());
        return new Response("ok", { status: 200 });
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
