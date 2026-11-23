# ভাইরাল ভিডিও জোন — Mini App

Telegram Mini App (ViralEarnZoneBot-এর "Open App"-এর মতো)।
বট: @viralvideolinkszone_bot — লাইভ: https://nova-ai-agent.duckdns.org/miniapp/

## কী আছে

- 🔍 সার্চ (নম্বর / ক্যাটাগরি), 📂 ক্যাটাগরি ট্যাব, সর্ট (নতুন / পুরনো / এলোমেলো)
- ভিডিও কার্ড গ্রিড — কার্ডে চাপ দিলে বট চ্যাটে ভিডিও পাঠায়
  (deep link `t.me/viralvideolinkszone_bot?start=watch_<n>`)
- কার্ডে আসল থাম্বনেল — প্রতিটি ভিডিওর ~১ সেকেন্ডের ফ্রেম থেকে
  640×360 ছবি, `videos.json`-এ base64 data URI হিসেবে বসানো থাকে
  (`tools/make-thumbs.py` দিয়ে বানানো হয়; নতুন ভিডিও এলে
  অটো-সিঙ্ক নিজে থেকে বানায়। আলাদা .jpg ফাইল GitHub-এ push করা
  যায় না — snapshot push শুধু UTF-8 টেক্সট নেয় — তাই ছবি
  videos.json-এর ভেতরেই থাকে। ২০MB-র বেশি ভিডিও Telegram
  getFile দেয় না, তাই সেগুলোর থাম্বনেল হয় না — কার্ডে রঙিন
  পোস্টার থাকে।)

## ভিডিও লিস্ট আপডেট

`videos.json` বটের `queue/library.json` থেকে বানানো হয়
(একই file_id দুইবার থাকলে একবারই রাখা হয়; নম্বর 1 থেকে শুরু)।

```bash
python3 tools/sync-miniapp-videos.py   # miniapp/videos.json নতুন করে বানায়
python3 tools/make-thumbs.py           # নতুন ভিডিওর থাম্বনেল বানায় + videos.json-এ thumb যোগ করে
```

তারপর `miniapp/videos.json` GitHub-এ push করলেই অ্যাপে নতুন ভিডিও আসবে।

## Adsgram গেট (এখনো বন্ধ)

ভিডিও খুলতে ৫টা অ্যাড × ১৫ সেকেন্ডের গেট `index.html`-এর
`ADSGRAM_BLOCK_ID`-এ Adsgram block ID বসালে চালু হবে।
ID না থাকলে গেট ছাড়াই সরাসরি ভিডিও খুলবে — কোনো ভুয়া অ্যাড দেখানো হয় না।
