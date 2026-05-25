# Deploy EthioClaw for Dad + Friends

Prepped and ready. When you get home, this is a 10-minute deploy.

## What You Need (2 things)

1. **Neon Postgres DB** → https://neon.tech (free tier, 500MB). Create project → copy connection string.
2. **Composio API Key** → https://dashboard.composio.dev/login?flow=developer. Sign up → Settings → API Keys → Generate.

Optional:
- **Fireworks API Key** → https://fireworks.ai/api-keys (only if you want Llama/Mixtral models, Claude works without it)
- **Telegram Bot** → message @BotFather, get token + username (only if you want them texting their agents)

## Deploy Steps

### 1. Fill in the env file

Open `/home/ray/trustclaw/.env` and replace the 2–3 `YOUR_..._HERE` placeholders with your real keys. Secrets are already generated for you.

```bash
# Replace these two (required):
DATABASE_URL=postgresql://...   # your neon connection string
COMPOSIO_API_KEY=sk-...         # your composio key

# Optional:
FIREWORKS_API_KEY=...            # only if you want fireworks models
TELEGRAM_BOT_TOKEN=...           # only if you want telegram
TELEGRAM_BOT_USERNAME=yourbot_bot
```

### 2. Login to Vercel

```bash
cd /home/ray/trustclaw
npx vercel login
```

### 3. Deploy

```bash
npx vercel --prod
```

It will ask if you want to link to an existing project → select **No**, create new. It auto-detects Next.js.

### 4. Add env vars to Vercel

After first deploy, go to your project in the Vercel dashboard → Settings → Environment Variables, and paste in the same values from `.env`:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `COMPOSIO_API_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL` (set to your deployed URL, e.g. `https://ethioclaw-xyz.vercel.app`)
- `FIREWORKS_API_KEY` (optional)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET` (optional)

Then redeploy:

```bash
npx vercel --prod
```

Done. Give your dad the URL, he signs up with username/password, goes through onboarding, and has his own agent.

## Limits (Hobby Tier)

- Cron jobs: once per day max (already set to daily in `vercel.json`)
- Function timeout: 5 minutes per agent turn
- If you need faster crons or longer timeouts later: Vercel Pro is $20/mo

## If You Want Telegram

After deploy, set your bot webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-app.vercel.app/api/telegram-webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

## Testing

Once deployed, sign up at `https://your-app.vercel.app` → dashboard → chat. Each user gets their own isolated instance, memory, and tool connections.
