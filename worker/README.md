# Nova AI Telegram Bot — Cloudflare Worker (Phase 4)

Free-tier webhook host for @nova_ai_helper2_bot. No secrets in this repo.

## Deploy (dashboard, no CLI needed)

1. Sign in to https://dash.cloudflare.com (Google sign-in works).
2. Workers & Pages → Create → Create Worker → name it `nova-ai-bot` → Deploy.
3. Open the Worker → Edit code → delete the starter code → paste the full
   contents of `worker.js` → Save and deploy.
4. Settings → Variables → Add variable (mark each as secret):
   - `TELEGRAM_BOT_TOKEN` — the token from @BotFather
   - `GROQ_API_KEY` — Groq console key (free tier)
5. Copy the Worker URL: `https://nova-ai-bot.<your-subdomain>.workers.dev`

## Connect the webhook

From this machine (token is in the Secure Vault, never in chat):

```text
python3 ~/workspace/custom-connectors/custom.telegram-bot/bin/telegram_bot.py set-webhook --url https://nova-ai-bot.<your-subdomain>.workers.dev
```

Verify:

```text
python3 ~/workspace/custom-connectors/custom.telegram-bot/bin/telegram_bot.py get-webhook-info
```

Then send `/start` to @nova_ai_helper2_bot in Telegram — it should reply
with the Bengali welcome. Any other message gets a real Groq AI reply.
