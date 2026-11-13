# WLC Discord Bot

A standalone, persistent Discord.js worker for Willes Literary Club. It lives inside the `wlc-web` repository but must run as a separate Node.js process (not as a Vercel serverless function).

## Current commands

- `/wlc` — help
- `/panels` — published GEN-1/2/3 record counts
- `/gen generation:GEN-1|GEN-2|GEN-3` — view a published panel
- `/announce message:<text> channel:<optional>` — publish an official embed (Manage Server permission)
- `/sync` — verify website panel data and prepare generation roles (Manage Server permission)
- `/play query:<song or link> source:<auto|soundcloud|youtube|spotify>` — search SoundCloud/YouTube Music or resolve Spotify links
- `/skip`, `/pause`, `/resume`, `/stop` — playback controls
- `/queue`, `/nowplaying`, `/volume level:<1-100>` — music information and controls
- `/radio enabled:true|false` — enable/disable automatic WLC radio (Manage Server permission)

## Setup

1. Create a Discord application and bot in the Discord Developer Portal.
2. Enable **Server Members Intent** under Developer Portal → Bot → Privileged Gateway Intents. The bot uses this to detect new members; it does not need Message Content Intent.
3. Invite the bot with `bot` and `applications.commands` scopes. Grant View Channels, Send Messages, Embed Links, Manage Roles, Manage Channels, Read Message History, Connect and Speak. Keep the bot's highest role above the auto-assigned role and any roles it manages.
4. Copy `.env.example` to `.env` and fill in the values.
5. In Railway, keep the existing bot worker as a persistent Node.js service with root directory `sahitya-club/discord-bot` and start command `npm start`.
6. Create a **second Railway service** from the same GitHub repository for Lavalink. Set its root directory to `sahitya-club/discord-bot/lavalink`; Railway will use the included Dockerfile. Add a TCP public or private network endpoint and note the host/port. Set `LAVALINK_PASSWORD` as a secret in the Lavalink service and in the bot service. The Lavalink service must remain running continuously.
7. In the bot service, set `LAVALINK_HOST`, `LAVALINK_PORT`, `LAVALINK_PASSWORD` and `LAVALINK_SECURE` to match the Lavalink service endpoint.
8. Set `MUSIC_GUILD_ID` to the WLC Discord server ID and `MUSIC_VOICE_CHANNEL_ID` to the dedicated voice channel ID. Optionally set `MUSIC_TEXT_CHANNEL_ID` to the music text channel where the player is associated. Set `MUSIC_RADIO_QUERIES` to semicolon-separated music search terms for the station. Radio and Auto search use SoundCloud only; YouTube is opt-in because server-side playback may be blocked by YouTube login checks. Optional: add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to the Lavalink service for Spotify text search.
9. In Vercel, keep the same `DISCORD_BOT_SYNC_SECRET` in the production environment. Keep it private; never use a `NEXT_PUBLIC_` variable.
10. Run `npm install` and `npm start` from the bot directory on the persistent Node.js host.

Set `DISCORD_GUILD_ID` for immediate per-server slash-command registration during setup. Omit it to register global commands (Discord propagation can take longer).

## Music architecture and operation

- The Discord bot uses `lavalink-client` 2.11.x, which supports Lavalink v4 and Discord DAVE voice encryption.
- The separate Lavalink 4.2.2 service performs audio streaming; YouTube source plugin 1.18.2 and LavaSrc 4.8.3 are enabled in `lavalink/application.yml`.
- On startup, the bot joins the configured WLC voice channel and starts a radio search. When the queue empties, it searches the next configured query and queues a new track.
- Members can add Spotify, SoundCloud and YouTube links, or search by source with `/play`. Auto search uses Soundcloud only, so it does not fall back to YouTube and trigger the current login restriction. YouTube Music is opt-in only. Spotify is a metadata resolver, not a native Spotify audio stream; LavaSrc mirrors Spotify tracks through SoundCloud. Spotify track search/links require Spotify Client ID and Client Secret on the Lavalink service. The bot only controls one active player per Discord server; members must join the same music voice channel to control it.
- `/radio enabled:false` stops the automatic station but leaves the player available for member requests. `/radio enabled:true` restarts it.
- Radio automatically starts again after a bot restart. A member-created queue is in memory and is not guaranteed to survive a full bot restart.
- YouTube may rate-limit or change extraction behavior. Keep the YouTube plugin updated and check Lavalink logs if searches or playback stop working. Use sources only in compliance with their terms.

## Data contract and current limitation

The website API `GET /api/discord/panels` is authenticated and read-only. It returns only Firestore `panel_members` documents with `status: "PUBLISHED"` and a `panelId` of GEN-1, GEN-2, or GEN-3.

GEN-3 already reads this collection on the website. The current GEN-1 and GEN-2 pages contain hard-coded panel arrays, so those records must be migrated into `panel_members` before they can appear in Discord. The bot deliberately does not scrape page markup or treat fallback/demo records as authoritative. No individual Discord account is linked to a WLC member yet; automatic per-person role assignment requires a verified member-ID linking flow.

## Security

- The bot token, sync secret and Lavalink password are server-side secrets.
- Do not commit `.env` or passwords.
- Keep the Lavalink service private to the bot service if possible; do not expose its REST endpoint publicly without network restrictions.
- The website API is read-only; Discord cannot edit membership or panel records.
- Announcement and sync commands require Manage Server permission.
