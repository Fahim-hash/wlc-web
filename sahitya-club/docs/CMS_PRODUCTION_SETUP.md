# Telegram CMS Production Setup

## Environment variables

Existing Firebase variables:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Server-side CMS:
- FIREBASE_SERVICE_ACCOUNT_JSON
- TELEGRAM_BOT_TOKEN
- TELEGRAM_WEBHOOK_SECRET
- TELEGRAM_ADMIN_IDS
- TELEGRAM_CONTROL_SECRET

Never expose FIREBASE_SERVICE_ACCOUNT_JSON, Telegram bot tokens, or control secrets with NEXT_PUBLIC_ prefixes.

## First migration

After production environment variables are configured, run the protected CMS seed endpoint once:

POST /api/cms/seed

Header:
x-wlc-control-secret: <TELEGRAM_CONTROL_SECRET>

The seed creates initial events, achievements, and the current running committee records. Re-running it is safe for the seeded IDs because writes are merged.

## Telegram CMS

Authorized Telegram accounts can use:

- /cms
- /panel — open the GEN-3 panel member manager
- /event title | date | time | venue | description | publish
- /member name | role | batch | bio | publish
- /achievement title | date | category | description | publish
- /announcement title | message | /link | publish
- /writing title | author | category | body | publish
- /knowledge title | answer | source | publish
- /cmslist events
- /cmslist members
- /archive <collection> <id>

Omitting publish creates a DRAFT. DRAFT records are never returned by public CMS endpoints.

## Media

Telegram channel posts are mirrored into:
- telegram_media — legacy compatibility
- media — normalized CMS media records
- albums — media-group metadata

The website can continue using the existing Telegram media delivery route.

### Telegram deletion limitation

Telegram Bot API does not provide a reliable channel-post-deletion update containing the deleted message ID. Therefore the server cannot truthfully guarantee immediate automatic detection of every manual Telegram deletion.

The CMS preserves Telegram identifiers so a reconciliation process can be added later if an authoritative media inventory/source becomes available.

## Security

- Telegram admin authorization uses TELEGRAM_ADMIN_IDS.
- CMS mutations require TELEGRAM_CONTROL_SECRET.
- Firestore server mutations use Firebase Admin SDK.
- Every CMS create/update/archive writes an audit_logs record.
- The old browser-side hardcoded admin PIN has been removed from /controlhub.

## GEN-3 Panel Manager

- The Telegram Control Hub has a GEN-3 Panel Manager tab.
- `/panel` opens the Telegram CMS menu; choose “প্যানেল সদস্য যোগ” to start a guided bot flow.
- Panel records are stored in `panel_members` with `panelId`, `group`, `department`, `name`, `role`, `sortOrder`, `status`, and optional `photoFileId`.
- Profile photos are uploaded to the configured Telegram media chat from the Mini App, or received by the bot as Telegram photos. Firestore stores Telegram file references, not image binaries.
- The GEN-3 website tree reads PUBLISHED records from Firestore. The first authenticated Control Hub load seeds the 28 supplied GEN-3 records if no GEN-3 records exist yet.

## Kothasokhi

Kothasokhi combines published `kothasokhi_knowledge` records, the live published GEN-3 `panel_members` records, and the WLC reference file `data/wlc-info.txt`. New panel names, roles, and departments therefore become available to the website chatbot and the separate Telegram Kothasokhi bot without a separate manual knowledge edit.

## Public pages migrated

- /events
- /achievements
- /panel/running

These pages read PUBLISHED Firestore records and revalidate periodically.
