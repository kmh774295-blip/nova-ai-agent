// Nova AI Telegram Bot — Cloudflare Worker (Phase 4)
// No secrets in this file. Set these in the Cloudflare dashboard
// (Worker → Settings → Variables → Add variable, mark as secret):
//   TELEGRAM_BOT_TOKEN — from @BotFather
//   GROQ_API_KEY       — Groq console (free tier); same key as the
//                        dashboard chat, or a second key named "Nova-Bot"
//   REPLICATE_API_TOKEN — replicate.com (free "Try for Free" runs, no card;
//                        needed only for /video; video model wan-2.2-t2v-fast)
const TELEGRAM_API = "https://api.telegram.org";
const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const REPLICATE_API = "https://api.replicate.com/v1";

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

async function englishPrompt(env, text) {
  // Turn a Bengali (or mixed) image request into a short English prompt
  // via Groq. Returns null when Groq fails, so the caller can ask the
  // user for an English prompt instead of generating a random image.
  try {
    const out = await groqReply(env, "Extract a short English image-generation prompt from this request. Reply with only the prompt, nothing else: " + text);
    return out.trim() || null;
  } catch (e) {
    return null;
  }
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

async function sendVideo(env, chatId, videoUrl, caption) {
  const res = await fetch(`${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendVideo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, video: videoUrl, caption: String(caption).slice(0, 1000) }),
  });
  return res.json();
}

async function makeVideo(env, chatId, rawText) {
  // Runs in the background (ctx.waitUntil): video takes minutes.
  try {
    let prompt = rawText;
    if (/[\u0980-\u09FF]/.test(rawText)) {
      prompt = await englishPrompt(env, rawText);
      if (!prompt) { await sendMessage(env, chatId, "ভিডিওর বর্ণনাটা ইংরেজিতে লিখো — যেমন: /video a mosque at sunset"); return; }
    }
    const create = await fetch(`${REPLICATE_API}/models/wan-video/wan-2.2-t2v-fast/predictions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.REPLICATE_API_TOKEN}`,
        Prefer: "wait",
      },
      body: JSON.stringify({ input: { prompt, resolution: "480p", duration: 5 } }),
    });
    if (!create.ok) {
      if (create.status === 402) throw new Error("billing");
      throw new Error("Replicate " + create.status);
    }
    let pred = await create.json();
    for (let i = 0; i < 36 && (pred.status === "starting" || pred.status === "processing"); i++) {
      await new Promise(r => setTimeout(r, 10000));
      const res = await fetch(`${REPLICATE_API}/predictions/${pred.id}`, {
        headers: { Authorization: `Bearer ${env.REPLICATE_API_TOKEN}` },
      });
      if (!res.ok) throw new Error("Replicate " + res.status);
      pred = await res.json();
    }
    if (pred.status === "succeeded") {
      const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
      if (!url) throw new Error("empty output");
      await sendVideo(env, chatId, url, "🎬 " + prompt);
    } else if (pred.status === "failed" || pred.status === "canceled") {
      throw new Error("failed: " + (pred.error || pred.status));
    } else {
      await sendMessage(env, chatId, "⏳ ভিডিও এখনো বানানো হচ্ছে — হয়ে গেলে পাঠাবো, একটু অপেক্ষা করো।");
    }
  } catch (e) {
    if (String(e.message) === "billing") {
      await sendMessage(env, chatId, "⚠️ Replicate-এর ফ্রি ভিডিও শেষ হয়ে গেছে — চালিয়ে যেতে Replicate-এ billing বসাতে হবে।");
    } else {
      await sendMessage(env, chatId, "⚠️ ভিডিও বানানো যায়নি — একটু পরে আবার চেষ্টা করো। (" + e.message + ")");
    }
  }
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
  async fetch(request, env, ctx) {
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
          "আসসালামু আলাইকুম! আমি Nova AI 👋\nআমাকে যেকোনো প্রশ্ন করো — বাংলা বা ইংরেজিতে।\nছবি বানাতে লিখো: /image <বর্ণনা> — যেমন: /image a mosque at sunset\nভিডিও বানাতে লিখো: /video <বর্ণনা> — যেমন: /video a mosque at sunset (কয়েক মিনিট লাগে)";
      } else if (/^(?:\/video)\s+(.+)/i.test(text) || (/(ভিডিও)/.test(text) && /(বানাও|তৈরি|দাও|চাই|বানিয়ে)/.test(text)) || (/\bvideo\b/i.test(text) && /(generate|make|create)/i.test(text))) {
        // Video generation (Replicate, Try for Free runs, no card).
        // Runs in the background — the webhook answers at once.
        if (!env.REPLICATE_API_TOKEN) {
          await sendMessage(env, chatId, "🎬 ভিডিও বানাতে Replicate টোকেন লাগবে — replicate.com থেকে টোকেন নিয়ে Worker-এর Variables-এ REPLICATE_API_TOKEN নামে বসাও, তারপর Deploy চাপো।");
          return new Response("ok", { status: 200 });
        }
        const rawText = /^(?:\/video)\s+(.+)/i.test(text)
          ? text.replace(/^(?:\/video)\s+/i, "").trim()
          : text;
        await sendMessage(env, chatId, "🎬 ভিডিও বানাচ্ছি — কয়েক মিনিট লাগতে পারে, হয়ে গেলে এখানেই পাঠাবো।");
        ctx.waitUntil(makeVideo(env, chatId, rawText));
        return new Response("ok", { status: 200 });
      } else if (/^(?:\/image)\s+(.+)/i.test(text)) {
        // /image <prompt>. Bengali prompts are turned into an English
        // prompt via Groq first — the image model cannot read Bengali.
        let prompt = text.replace(/^(?:\/image)\s+/i, "").trim();
        if (/[\u0980-\u09FF]/.test(prompt)) {
          prompt = await englishPrompt(env, prompt);
          if (!prompt) { await sendMessage(env, chatId, "ছবির বর্ণনাটা ইংরেজিতে লিখো — যেমন: /image a mosque at sunset"); return new Response("ok", { status: 200 }); }
        }
        await sendImage(env, chatId, prompt);
        return new Response("ok", { status: 200 });
      } else if (/(ছবি|ইমেজ)/.test(text) && /(বানাও|তৈরি|আঁক|দাও|চাই|বানিয়ে)/.test(text)) {
        // Bengali image request, e.g. "একটা মসজিদের ছবি তৈরি করে দাও"
        // or "একটা ইমেজ তৈরি করো" — Groq extracts the English prompt.
        const prompt = await englishPrompt(env, text);
        if (!prompt) { await sendMessage(env, chatId, "ছবির বর্ণনাটা ইংরেজিতে লিখো — যেমন: /image a mosque at sunset"); return new Response("ok", { status: 200 }); }
        await sendImage(env, chatId, prompt);
        return new Response("ok", { status: 200 });
      } else if (/\b(image|picture|photo)\b/i.test(text) && /(generate|make|create|draw|show|give)/i.test(text)) {
        const prompt = await englishPrompt(env, text);
        if (!prompt) { await sendMessage(env, chatId, "ছবির বর্ণনাটা ইংরেজিতে লিখো — যেমন: /image a mosque at sunset"); return new Response("ok", { status: 200 }); }
        await sendImage(env, chatId, prompt);
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
