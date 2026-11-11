# WLC Discord Bot

A standalone, persistent Discord.js worker for Willes Literary Club. It lives inside the `wlc-web` repository but must run as a separate Node.js process (not as a Vercel serverless function).

## Current commands

- `/wlc` — help
- `/panels` — published GEN-1/2/3 record counts
- `/gen generation:GEN-1|GEN-2|GEN-3` — view a published panel
- `/announce message:<text> channel:<optional>` — publish an official embed (Manage Server permission)
- `/sync` — verify website panel data and prepare generation roles (Manage Server permission)

## Setup

1. Create a Discord application and bot in the Discord Developer Portal.
2. Enable the **Server Members Intent** only if future member-to-account role assignment is required. This first version uses slash commands and does not read message content.
3. Invite the bot with `bot` and `applications.commands` scopes. Grant View Channels, Send Messages, Embed Links, Manage Roles, and Read Message History as needed. Keep the bot's highest role above the WLC generation roles.
4. Copy `.env.example` to `.env` and fill in the values.
5. In Vercel, add the same `DISCORD_BOT_SYNC_SECRET` to the production environment. Keep it private; never use a `NEXT_PUBLIC_` variable.
6. Run `npm install` and `npm start` from this directory on a persistent Node.js host.

Set `DISCORD_GUILD_ID` for immediate per-server slash-command registration during setup. Omit it to register global commands (Discord propagation can take longer).

## Data contract and current limitation

The website API `GET /api/discord/panels` is authenticated and read-only. It returns only Firestore `panel_members` documents with `status: "PUBLISHED"` and a `panelId` of GEN-1, GEN-2, or GEN-3.

GEN-3 already reads this collection on the website. The current GEN-1 and GEN-2 pages contain hard-coded panel arrays, so those records must be migrated into `panel_members` before they can appear in Discord. The bot deliberately does not scrape page markup or treat fallback/demo records as authoritative. No individual Discord account is linked to a WLC member yet; automatic per-person role assignment requires a verified member-ID linking flow.

## Security

- The bot token and sync secret are server-side secrets.
- The API is read-only; Discord cannot edit membership or panel records.
- Announcement and sync commands require Manage Server permission.
- Do not commit `.env` or tokens.
