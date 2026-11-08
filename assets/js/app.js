/* ============================================================
   NOVA AI — Dashboard App (Phase 1–3)
   Static · No backend · No secrets · No tracking
   - Language: Bengali / English (localStorage)
   - Agent toggles + chat (real Groq AI when a key is saved,
     keyword demo replies as fallback)
   - VPN tables rendered from assets/js/vpn-servers.js
   - API key is stored ONLY in this browser (localStorage)
   ============================================================ */
"use strict";

const $  = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

/* ---------------- i18n ---------------- */
const I18N = {
  bn: {
    "nav.dashboard": "ড্যাশবোর্ড", "nav.agents": "এজেন্ট", "nav.chat": "চ্যাট",
    "nav.vpn": "ভিপিএন", "nav.settings": "সেটিংস",
    "hero.title": "Welcome to <span>Nova AI</span> 🚀",
    "hero.sub": "তোমার নিজের All-in-One AI Agent System-এ স্বাগতম। এখানে ছয়টি এজেন্ট এক জায়গা থেকে পরিচালনা করতে পারবে — সম্পূর্ণ ফ্রি।",
    "hero.chat": "💬 AI চ্যাট শুরু করো", "hero.vpn": "🛡️ VPN সার্ভার দেখো",
    "stat.agents": "AI এজেন্ট", "stat.cost": "মাসিক খরচ", "stat.free": "ফ্রি টিয়ার",
    "agents.title": "🤖 আমার AI এজেন্ট", "agents.sub": "যেকোনো এজেন্ট চালু করো — স্ট্যাটাস এই ব্রাউজারেই সংরক্ষিত থাকে।",
    "chat.title": "💬 Nova AI Chat", "chat.demo": "DEMO MODE",
    "chat.ph": "এখানে মেসেজ লিখো... (যেমন: ভিপিএন, সময়, এজেন্ট)",
    "chat.send": "পাঠাও",
    "chat.hint": "Key সংরক্ষিত থাকলে আসল AI উত্তর দেবে — Key শুধু এই ব্রাউজারেই থাকে, কোথাও পাঠানো হয় না। Key না থাকলে ডেমো উত্তর আসবে।",
    "chat.live": "AI LIVE",
    "chat.err": "⚠️ AI-এর সাথে সংযোগ হয়নি — Key ঠিক আছে কি না Settings-এ দেখো, অথবা আবার চেষ্টা করো।",
    "chat.hello": "আসসালামু আলাইকুম! আমি Nova AI 👋\nআমি কী করতে পারি:\n• এজেন্টদের অবস্থা জানতে পারো\n• VPN সার্ভার দেখতে পারো\n• সময় জানতে পারো\nযেকোনো প্রশ্ন লিখো!",
    "vpn.title": "🛡️ Nova VPN Agent",
    "vpn.sub": "যাচাই করা পাবলিক ফ্রি সার্ভার — কোনো ভুয়া সার্ভার নেই। কানেক্ট করার আগে লাইভ লিস্ট দেখে নাও।",
    "vpn.proton": "Proton VPN — ফ্রি US সার্ভার",
    "vpn.gate": "VPN Gate — US সার্ভার (ভলান্টিয়ার)",
    "vpn.verified": "সর্বশেষ যাচাই",
    "vpn.note": "⚠️ VPN Gate সার্ভারগুলো ভলান্টিয়ারদের — যেকোনো সময় বন্ধ হতে পারে। Proton ফ্রি সার্ভারগুলো স্থিতিশীল। এই তালিকা পাবলিক সোর্স থেকে যাচাই করা; কোনো সার্ভারই Nova-র নিজের নয়।",
    "vpn.creds": "VPN Gate লগইন: ইউজারনেম ও পাসওয়ার্ড দুটোই",
    "vpn.guide": "WireGuard / OpenVPN দিয়ে কানেক্ট করার ধাপ",
    "vpn.live": "🔗 লাইভ সার্ভার লিস্ট দেখো (vpngate.net)",
    "set.title": "⚙️ Settings",
    "set.sub": "ভাষা, থিম ও সংযোগ — সবকিছু শুধু এই ব্রাউজারেই থাকে।",
    "set.lang": "ভাষা / Language", "set.lang.sub": "ড্যাশবোর্ডের ভাষা বদলাও",
    "set.accent": "থিম রঙ / Accent", "set.accent.sub": "Purple নাকি Blue নিয়ন থিম",
    "set.key": "AI API Key (Phase 3)", "set.key.sub": "শুধু এই ব্রাউজারে সংরক্ষিত হয় — GitHub-এ বা কোথাও পাঠানো হয় না।",
    "set.key.ph": "তোমার API Key এখানে লিখো (যেমন: Groq)",
    "set.key.save": "সংরক্ষণ করো", "set.key.saved": "✅ সংরক্ষিত হয়েছে (এই ব্রাউজারেই)",
    "set.key.none": "কোনো Key সংরক্ষিত নেই",
    "set.reset": "সব ডেটা মুছে ফেলো", "set.reset.sub": "এজেন্ট স্ট্যাটাস, ভাষা ও Key — সব রিসেট হবে",
    "set.reset.btn": "রিসেট করো",
    "status.active": "● Active", "status.demo": "● Demo",
    "btn.activate": "Activate", "btn.deactivate": "Deactivate",
    "copy": "কপি", "copied": "✅ কপি হয়েছে",
    "foot.made": "Nova AI Agent System © 2026 · সম্পূর্ণ ফ্রি ও ওপেন",
    "foot.note": "কোনো API Key, পাসওয়ার্ড বা টোকেন এই Repository-তে রাখা হয় না।",
    "agent.personal": "পার্সোনাল এজেন্ট", "agent.personal.d": "বাংলা ও ইংরেজিতে কথা বলবে — প্রশ্নের উত্তর ও ব্যক্তিগত সহকারী।",
    "agent.telegram": "টেলিগ্রাম এজেন্ট", "agent.telegram.d": "Telegram Bot তৈরি ও পরিচালনা — স্বয়ংক্রিয় উত্তর ও AI চ্যাট সাপোর্ট।",
    "agent.website": "ওয়েবসাইট এজেন্ট", "agent.website.d": "ওয়েবসাইটের AI Chatbot — ভিজিটর সাপোর্ট ও FAQ উত্তর।",
    "agent.android": "অ্যান্ড্রয়েড এজেন্ট", "agent.android.d": "Android ব্যবহারে সহায়তা — অনুমোদিত কাজের অটোমেশন ও মোবাইল নিয়ন্ত্রণ।",
    "agent.automation": "অটোমেশন এজেন্ট", "agent.automation.d": "Scheduled Task, Workflow Automation, Notification ও Reminder।",
    "agent.vpn": "Nova VPN এজেন্ট", "agent.vpn.d": "VPN ড্যাশবোর্ড — WireGuard কনফিগ ও ফ্রি VPN সার্ভার পরিচালনা।",
    "guide.1": "<b>Proton অ্যাপ</b> ইনস্টল করো — Settings → Protocol → <b>Stealth</b> বেছে নাও।",
    "guide.2": "US সার্ভার সিলেক্ট করে <b>Connect</b> চাপো — অ্যাপ নিজেই চালু সার্ভার খুঁজে নেবে।",
    "guide.3": "অথবা <b>OpenVPN for Android</b> অ্যাপে VPN Gate-এর .ovpn ফাইল ইমপোর্ট করো (ইউজারনেম/পাসওয়ার্ড: vpn)।",
    "guide.4": "কানেক্ট হলে ব্রাউজারে <b>whatismyip.com</b> খুলে IP কোন দেশের দেখাচ্ছে যাচাই করো।",
    "auto.title": "⚙️ Automation Agent",
    "auto.sub": "সময়মতো স্বয়ংক্রিয় কাজ — GitHub Actions দিয়ে চলে, সম্পূর্ণ ফ্রি।",
    "auto.th.task": "কাজ", "auto.th.when": "কখন", "auto.th.via": "মাধ্যম", "auto.th.status": "অবস্থা",
    "auto.task1": "🌅 সকালের রিমাইন্ডার (সকালের জিকির)",
    "auto.task1.when": "প্রতিদিন সকাল ৬:০০ (ঢাকা)",
    "auto.note": "টোকেন ও চ্যাট ID GitHub Secrets-এ থাকে — Repository-তে কখনো রাখা হয় না। Actions ট্যাব থেকে যেকোনো সময় হাতে চালিয়ে পরীক্ষা করা যায়।"
  },
  en: {
    "nav.dashboard": "Dashboard", "nav.agents": "Agents", "nav.chat": "Chat",
    "nav.vpn": "VPN", "nav.settings": "Settings",
    "hero.title": "Welcome to <span>Nova AI</span> 🚀",
    "hero.sub": "Welcome to your own All-in-One AI Agent System. Manage six agents from one place — completely free.",
    "hero.chat": "💬 Start AI Chat", "hero.vpn": "🛡️ View VPN Servers",
    "stat.agents": "AI Agents", "stat.cost": "Monthly Cost", "stat.free": "Free Tier",
    "agents.title": "🤖 My AI Agents", "agents.sub": "Activate any agent — status is saved in this browser only.",
    "chat.title": "💬 Nova AI Chat", "chat.demo": "DEMO MODE",
    "chat.ph": "Type a message... (try: vpn, time, agents)",
    "chat.send": "Send",
    "chat.hint": "With a saved key you get real AI answers — the key stays only in this browser, it is never sent anywhere. Without a key, demo replies.",
    "chat.live": "AI LIVE",
    "chat.err": "⚠️ Couldn't reach the AI — check the key in Settings, or try again.",
    "chat.hello": "Hello! I am Nova AI 👋\nI can help you:\n• Check agent status\n• Show VPN servers\n• Tell the time\nAsk me anything!",
    "vpn.title": "🛡️ Nova VPN Agent",
    "vpn.sub": "Verified public free servers — no fake servers. Check the live list before connecting.",
    "vpn.proton": "Proton VPN — Free US Servers",
    "vpn.gate": "VPN Gate — US Servers (volunteer)",
    "vpn.verified": "Last verified",
    "vpn.note": "⚠️ VPN Gate servers are volunteer-run and can go offline anytime. Proton free servers are more stable. This list is verified from public sources; no server here belongs to Nova.",
    "vpn.creds": "VPN Gate login: username and password are both",
    "vpn.guide": "Steps to connect with WireGuard / OpenVPN",
    "vpn.live": "🔗 View live server list (vpngate.net)",
    "set.title": "⚙️ Settings",
    "set.sub": "Language, theme and connection — everything stays in this browser.",
    "set.lang": "Language / ভাষা", "set.lang.sub": "Change the dashboard language",
    "set.accent": "Accent Theme", "set.accent.sub": "Purple or Blue neon theme",
    "set.key": "AI API Key (Phase 3)", "set.key.sub": "Stored only in this browser — never sent to GitHub or anywhere.",
    "set.key.ph": "Paste your API key here (e.g. Groq)",
    "set.key.save": "Save", "set.key.saved": "✅ Saved (in this browser only)",
    "set.key.none": "No key saved",
    "set.reset": "Erase all data", "set.reset.sub": "Agent status, language and key — everything resets",
    "set.reset.btn": "Reset",
    "status.active": "● Active", "status.demo": "● Demo",
    "btn.activate": "Activate", "btn.deactivate": "Deactivate",
    "copy": "Copy", "copied": "✅ Copied",
    "foot.made": "Nova AI Agent System © 2026 · Completely free & open",
    "foot.note": "No API key, password or token is stored in this repository.",
    "agent.personal": "Personal Agent", "agent.personal.d": "Talks in Bengali & English — answers questions, your personal assistant.",
    "agent.telegram": "Telegram Agent", "agent.telegram.d": "Create & manage Telegram bots — auto-replies and AI chat support.",
    "agent.website": "Website Agent", "agent.website.d": "Website AI chatbot — visitor support and FAQ answers.",
    "agent.android": "Android Agent", "agent.android.d": "Help with Android use — automation of approved tasks and mobile control.",
    "agent.automation": "Automation Agent", "agent.automation.d": "Scheduled tasks, workflow automation, notifications & reminders.",
    "agent.vpn": "Nova VPN Agent", "agent.vpn.d": "VPN dashboard — WireGuard config and free VPN server management.",
    "guide.1": "Install the <b>Proton app</b> — Settings → Protocol → choose <b>Stealth</b>.",
    "guide.2": "Pick a US server and tap <b>Connect</b> — the app finds a live server itself.",
    "guide.3": "Or import a VPN Gate .ovpn file into <b>OpenVPN for Android</b> (username/password: vpn).",
    "guide.4": "After connecting, open <b>whatismyip.com</b> in your browser to verify which country your IP shows.",
    "auto.title": "⚙️ Automation Agent",
    "auto.sub": "Scheduled automatic work — runs on GitHub Actions, completely free.",
    "auto.th.task": "Task", "auto.th.when": "When", "auto.th.via": "Via", "auto.th.status": "Status",
    "auto.task1": "🌅 Morning reminder (morning dhikr)",
    "auto.task1.when": "Every day 6:00 AM (Dhaka)",
    "auto.note": "The token and chat ID live in GitHub Secrets — never in the repository. Run it manually anytime from the Actions tab to test."
  }
};

/* ---------------- Agents ---------------- */
const AGENTS = [
  { id: "personal",   icon: "🧠", phase: "Phase 3" },
  { id: "telegram",   icon: "💬", phase: "Phase 4" },
  { id: "website",    icon: "🌐", phase: "Phase 3" },
  { id: "android",    icon: "📱", phase: "Phase 6" },
  { id: "automation", icon: "⚙️", phase: "Phase 5" },
  { id: "vpn",        icon: "🛡️", phase: "Phase 7" }
];

const store = {
  get(k, d) { try { const v = localStorage.getItem("nova:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("nova:" + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem("nova:" + k); } catch (e) {} }
};

let lang = store.get("lang", "bn");
let accent = store.get("accent", "purple");
let activeAgents = store.get("agents", {});
const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.bn[key] || key;

/* ---------------- Language ---------------- */
function applyLang() {
  document.documentElement.lang = lang === "bn" ? "bn" : "en";
  $$("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$(".lang-toggle button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  renderAgents();
  renderVpn();
  renderKeyState();
  updateChatBadge();
  const hello = $("#messages .msg.bot");
  if (hello && !hello.dataset.custom) hello.textContent = t("chat.hello");
}

function setLang(l) { lang = (l === "en") ? "en" : "bn"; store.set("lang", lang); applyLang(); }

/* ---------------- Agents ---------------- */
function renderAgents() {
  const grid = $("#agents");
  if (!grid) return;
  grid.innerHTML = AGENTS.map((a) => {
    const on = !!activeAgents[a.id];
    const badge = on
      ? '<span class="status-badge active">' + t("status.active") + "</span>"
      : '<span class="status-badge demo">' + t("status.demo") + "</span>";
    return '<div class="card">' +
      '<div class="card-top"><div class="card-emoji">' + a.icon + "</div>" +
      '<div><h3>' + t("agent." + a.id) + "</h3>" +
      '<p class="desc">' + t("agent." + a.id + ".d") + "</p></div></div>" +
      '<div class="card-foot">' + badge +
      '<span class="phase-tag">' + a.phase + "</span>" +
      '<button class="btn' + (on ? "" : " off") + '" data-agent="' + a.id + '">' +
      (on ? t("btn.deactivate") : t("btn.activate")) + "</button></div></div>";
  }).join("");
  $$("#agents [data-agent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.agent;
      activeAgents[id] = !activeAgents[id];
      store.set("agents", activeAgents);
      renderAgents();
      updateHeader();
    });
  });
}

function updateHeader() {
  const n = AGENTS.filter((a) => activeAgents[a.id]).length;
  const pill = $("#active-pill");
  if (pill) pill.innerHTML = '<span class="dot"></span>' + n + "/6 " + (lang === "bn" ? "Active" : "Active");
}

/* ---------------- Chat (demo) ---------------- */
function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function addMsg(text, who) {
  const box = $("#messages");
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
function demoReply(text) {
  const q = text.toLowerCase();
  const bn = lang === "bn";
  if (/আসসালামু|assalamu|সালাম|salam|hello|হ্যালো|^hi\b|^hey\b/.test(q))
    return bn ? "ওয়ালাইকুম আসসালাম! 👋 আমি Nova AI। কী সাহায্য করতে পারি?" : "Hello! 👋 I am Nova AI. How can I help?";
  if (/vpn|ভিপিএন|সার্ভার|server/.test(q))
    return bn ? "VPN সেকশনে যাচাই করা ফ্রি US সার্ভার আছে — Proton (node-us-132.protonvpn.net) আর VPN Gate। কোনো ভুয়া সার্ভার নেই। নিচে স্ক্রল করে দেখো! 🛡️"
              : "The VPN section has verified free US servers — Proton (node-us-132.protonvpn.net) and VPN Gate. No fake servers. Scroll down to see them! 🛡️";
  if (/এজেন্ট|agent/.test(q))
    return bn ? "আমার ৬টি এজেন্ট: পার্সোনাল, টেলিগ্রাম, ওয়েবসাইট, অ্যান্ড্রয়েড, অটোমেশন আর Nova VPN। উপরের কার্ড থেকে যেকোনোটি Activate করতে পারো। 🤖"
              : "I have 6 agents: Personal, Telegram, Website, Android, Automation and Nova VPN. Activate any of them from the cards above. 🤖";
  if (/সময়|time|তারিখ|date|কয়টা/.test(q)) {
    const now = new Date().toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", { timeZone: "Asia/Dhaka", dateStyle: "full", timeStyle: "short" });
    return (bn ? "এখন ঢাকায়: " : "Current time in Dhaka: ") + now;
  }
  if (/ধন্যবাদ|thank/.test(q))
    return bn ? "তোমাকেও ধন্যবাদ! 😊 আর কিছু জানতে চাও?" : "You're welcome! 😊 Anything else?";
  if (/সাহায্য|help|কী পারো|what can you/.test(q))
    return bn ? "আমি এখন ডেমো মোডে আছি। আমি পারি: এজেন্টের তথ্য দেওয়া, VPN সার্ভার দেখানো, সময় বলা। আসল AI চ্যাট আসছে Phase 3-এ! ✨"
              : "I am in demo mode right now. I can: explain agents, show VPN servers, tell the time. Real AI chat arrives in Phase 3! ✨";
  if (/nova|নোভা/.test(q))
    return bn ? "Nova AI — তোমার নিজের All-in-One AI Agent System। ৬টি এজেন্ট, সম্পূর্ণ ফ্রি, GitHub Pages-এ হোস্ট করা। 🚀"
              : "Nova AI — your own All-in-One AI Agent System. 6 agents, completely free, hosted on GitHub Pages. 🚀";
  return bn ? "এটি এখন ডেমো চ্যাট — এই প্রশ্নের উত্তর আসল AI সংযোগের (Phase 3) পর পাবে। আপাতত 'ভিপিএন', 'এজেন্ট' বা 'সময়' লিখে দেখো!"
            : "This is a demo chat — this question needs the real AI connection (Phase 3). For now try 'vpn', 'agents' or 'time'!";
}
function sendMessage() {
  const input = $("#question");
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, "user");
  input.value = "";
  const typing = addMsg("Nova AI " + (lang === "bn" ? "লিখছে..." : "is typing..."), "bot");
  typing.classList.add("typing");
  const finish = (reply) => {
    typing.textContent = reply;
    typing.classList.remove("typing");
    typing.dataset.custom = "1";
    $("#messages").scrollTop = $("#messages").scrollHeight;
  };
  const key = store.get("apiKey", "");
  if (!key) {
    setTimeout(() => finish(demoReply(text)), 500);
    return;
  }
  groqReply(text).then(finish).catch(() => finish(t("chat.err")));
}
/* Real AI via Groq (free tier) — key read from this browser only,
   never stored in the repo. Falls back to demo replies when offline. */
async function groqReply(text) {
  const key = store.get("apiKey", "");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: lang === "bn"
          ? "তুমি Nova AI — একজন বন্ধুসুলভ পার্সোনাল AI সহকারী। ব্যবহারকারী যে ভাষায় লিখবে (বাংলা বা ইংরেজি), সেই ভাষায় উত্তর দাও। সংক্ষিপ্ত ও সহজ ভাষায় উত্তর দাও।"
          : "You are Nova AI — a friendly personal AI assistant. Answer in the language the user writes in (Bengali or English). Keep answers short and simple." },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  });
  if (!res.ok) throw new Error("Groq " + res.status);
  const data = await res.json();
  const out = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!out) throw new Error("empty reply");
  return out.trim();
}

/* ---------------- VPN ---------------- */
function copyText(text, btn) {
  const done = () => { const old = btn.textContent; btn.textContent = t("copied"); setTimeout(() => { btn.textContent = old; }, 1200); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(ta);
}
function renderVpn() {
  const data = (typeof NOVA_VPN_SERVERS !== "undefined") ? NOVA_VPN_SERVERS : null;
  const v = $("#vpn-verified");
  if (v && data) v.textContent = t("vpn.verified") + ": " + data.verifiedAt;
  const pBody = $("#proton-rows");
  if (pBody && data) {
    pBody.innerHTML = data.protonFreeUS.map((s) => {
      const bar = s.load === null ? "—" : '<div class="load-bar"><i style="width:' + s.load + '%"></i></div> ' + s.load + "%";
      return "<tr><td>" + s.name + "</td><td><code>" + s.host + "</code></td><td>" + s.city + "</td><td>" + bar + "</td>" +
        '<td><button class="copy-btn" data-copy="' + s.host + '">' + t("copy") + "</button></td></tr>";
    }).join("");
  }
  const gBody = $("#gate-rows");
  if (gBody && data) {
    gBody.innerHTML = data.vpnGateUS.map((s) => {
      return "<tr><td><code>" + s.host + "</code></td><td><code>" + s.ip + "</code></td><td>" + s.speed + "</td><td>" + s.ping + " ms</td>" +
        '<td><button class="copy-btn" data-copy="' + s.host + '">' + t("copy") + "</button></td></tr>";
    }).join("");
  }
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.dataset.copy, btn));
  });
}

/* ---------------- Settings ---------------- */
function applyAccent() {
  document.documentElement.setAttribute("data-accent", accent);
  $$(".swatch").forEach((s) => s.classList.toggle("on", s.dataset.accent === accent));
}
function renderKeyState() {
  const el = $("#key-state");
  if (!el) return;
  const k = store.get("apiKey", "");
  el.textContent = k ? "● " + t("set.key.saved") + " (" + k.length + " chars)" : t("set.key.none");
}
function updateChatBadge() {
  const badge = $(".demo-badge");
  if (!badge) return;
  const live = !!store.get("apiKey", "");
  badge.textContent = live ? t("chat.live") : t("chat.demo");
  badge.classList.toggle("live", live);
}
function initSettings() {
  $$(".swatch").forEach((s) => {
    s.addEventListener("click", () => { accent = s.dataset.accent; store.set("accent", accent); applyAccent(); });
  });
  const saveBtn = $("#save-key");
  if (saveBtn) saveBtn.addEventListener("click", () => {
    const inp = $("#api-key");
    const v = inp.value.trim();
    if (v) { store.set("apiKey", v); inp.value = ""; }
    renderKeyState();
    updateChatBadge();
  });
  const resetBtn = $("#reset-all");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    ["lang", "accent", "agents", "apiKey"].forEach((k) => store.del(k));
    location.reload();
  });
}

/* ---------------- Header clock ---------------- */
function tickClock() {
  const el = $("#clock");
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" }) + " (Dhaka)";
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyAccent();
  applyLang();
  updateHeader();
  initSettings();
  renderKeyState();
  tickClock();
  setInterval(tickClock, 30000);
  const sendBtn = $("#send-btn");
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  const input = $("#question");
  if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
  $$(".lang-toggle button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $$(".bottom-nav a").forEach((a) => {
    a.addEventListener("click", () => {
      $$(".bottom-nav a").forEach((x) => x.classList.remove("on"));
      a.classList.add("on");
    });
  });
});
