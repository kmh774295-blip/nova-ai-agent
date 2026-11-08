# ✦ Nova AI — All-in-One AI Agent System

**Nova AI** is a free, mobile-first, all-in-one AI agent platform.
Six agents, one dashboard — hosted free on GitHub Pages. No VPS, no cost.

🌐 **Live site:** https://kmh774295-blip.github.io/nova-ai-agent/

## 🤖 The 6 Agents

| # | Agent | Phase | Status |
|---|-------|-------|--------|
| 1 | 🧠 Personal AI Agent | Phase 3 | ✅ Live (Groq, browser key) |
| 2 | 💬 Telegram AI Agent | Phase 4 | ✅ Live (@nova_ai_helper2_bot — chat, /image, /video) |
| 3 | 🌐 Website AI Agent | Phase 3 | ✅ Live (dashboard chat) |
| 4 | 📱 Android AI Agent | Phase 6 | ✅ Live (PWA — install, voice input, share) |
| 5 | ⚙️ Automation Agent | Phase 5 | ⏳ Workflow built — needs 2 repo secrets + test |
| 6 | 🛡️ Nova VPN Agent | Phase 7 | Live data (verified servers, guide) |

## ✨ Dashboard Features (Phase 1 — done)

- 🌙 Dark mode, purple/blue neon theme
- 📱 Mobile-first responsive + bottom navigation
- 🌐 Bengali / English language toggle (saved in browser)
- 🧠 6 agent cards with Activate/Deactivate (saved in browser)
- 💬 Demo AI chat (keyword replies in Bengali & English)
- 🛡️ VPN section with **verified real servers only** — Proton free US servers
  + VPN Gate US servers, with copy buttons and WireGuard/OpenVPN guide
- ⚙️ Settings: language, accent theme, API key (browser-only), reset
- 🔒 **No secrets in this repo** — see Security below

## 📱 Android Agent (Phase 6 — done)

- 📲 **Installable PWA** — `manifest.webmanifest` + service worker (`sw.js`):
  Chrome → ⋮ → **Install app** / **Add to Home screen**; dashboard shell
  works offline after install (live AI chat still needs internet).
- 🎙️ **Voice input in chat** — mic button, Bengali (`bn-BD`) / English
  by dashboard language; hidden automatically where unsupported.
- 🔗 **Share Nova** — Android share sheet, clipboard fallback.
- ⚡ **App shortcuts** — Chat, VPN, Telegram Bot, Automation (long-press
  the home-screen icon).
- Not a Play Store app — a free web app installed from Chrome, no
  permissions, no cost.

## 📁 Project Structure

```
nova-ai-agent/
├── index.html                  # Dashboard (single page)
├── manifest.webmanifest        # PWA manifest (Phase 6)
├── sw.js                       # Offline cache for the dashboard shell (Phase 6)
├── assets/
│   ├── css/style.css           # Neon dark theme, mobile-first
│   ├── icons/                  # PWA icon (SVG, Phase 6)
│   └── js/
│       ├── app.js              # i18n, agents, chat, VPN render, settings, PWA
│       └── vpn-servers.js      # Verified PUBLIC server list (no secrets)
├── worker/                     # Telegram bot (Cloudflare Worker, Phase 4)
├── .github/workflows/          # Automation (Phase 5)
├── .nojekyll                   # Serve files as-is on GitHub Pages
└── README.md
```

## 🚀 Deploy (GitHub Pages)

1. GitHub repo → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · Folder: `/ (root)` → **Save**
4. Wait ~1 minute → site is live at
   `https://kmh774295-blip.github.io/nova-ai-agent/`

## 🔒 Security Policy

- **Never** commit API keys, passwords, bot tokens or secrets to this repo.
- The dashboard's API key field (Phase 3) stores the key in the **browser's
  localStorage only** — it is never sent to GitHub or any server by this site.
- VPN data in `assets/js/vpn-servers.js` is **public server addresses only**
  (Proton free servers + VPN Gate volunteer servers), verified from public
  sources. No fake servers, no fake connections.
- Real AI chat (Phase 3) will call the provider API **directly from the
  user's browser** with their own key, or via a serverless proxy whose secret
  lives in the provider dashboard — never in this repo.

## 🗺️ Roadmap

- **Phase 1** — Dashboard ✅
- **Phase 2** — GitHub Pages live ✅
- **Phase 3** — Real AI chat ✅ (Groq, browser-only key)
- **Phase 4** — Telegram AI bot ✅ (live: chat, /image, /video)
- **Phase 5** — Automation system ⏳ (workflow built, needs 2 repo secrets + test)
- **Phase 6** — Android agent ✅ (PWA install, voice input, share, shortcuts)
- **Phase 7** — Nova VPN management (live server refresh, WireGuard configs)
- **Phase 8** — Full testing & final launch

## 📜 License

MIT — free to use and modify.

---
Built with ❤️ by Nova AI · রিয়াদ হোসেন
