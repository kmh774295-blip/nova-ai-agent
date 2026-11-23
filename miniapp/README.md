# ভাইরাল ভিডিও জোন — Mini App

Telegram Mini App (ViralEarnZoneBot-এর "Open App"-এর মতো)।
বট: @viralvideolinkszone_bot — লাইভ: https://nova-ai-agent.duckdns.org/miniapp/

## কী আছে

- 🔍 সার্চ (নম্বর / ক্যাটাগরি), 📂 ক্যাটাগরি ট্যাব, সর্ট (নতুন / পুরনো / এলোমেলো)
- ভিডিও কার্ড গ্রিড — কার্ডে চাপ দিলে বট চ্যাটে ভিডিও পাঠায়
  (deep link `t.me/viralvideolinkszone_bot?start=watch_<n>`)
- কার্ডে আসল থাম্বনেল নেই — ভিডিও থেকে ফ্রেম তোলা হয় না
  (অন্যের ভিডিওর ছবি পাবলিক করা যাবে না); রঙিন পোস্টার + নম্বর দেখায়

## ভিডিও লিস্ট আপডেট

`videos.json` বটের `queue/library.json` থেকে বানানো হয়
(একই file_id দুইবার থাকলে একবারই রাখা হয়; নম্বর 1 থেকে শুরু)।

```bash
python3 tools/sync-miniapp-videos.py   # miniapp/videos.json নতুন করে বানায়
```

তারপর `miniapp/videos.json` GitHub-এ push করলেই অ্যাপে নতুন ভিডিও আসবে।

## Adsgram গেট (এখনো বন্ধ)

ভিডিও খুলতে ৫টা অ্যাড × ১৫ সেকেন্ডের গেট `index.html`-এর
`ADSGRAM_BLOCK_ID`-এ Adsgram block ID বসালে চালু হবে।
ID না থাকলে গেট ছাড়াই সরাসরি ভিডিও খুলবে — কোনো ভুয়া অ্যাড দেখানো হয় না।
