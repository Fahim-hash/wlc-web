# WLC Web — Telegram-Controlled CMS Roadmap

## Product direction

The WLC website should become a presentation layer driven by a central content system. Telegram is the primary admin/control interface. Firebase Firestore stores structured/text content and Telegram remains the media source of truth for photos, albums, videos, posters, and documents.

### Target architecture

Telegram Bot (WLC Control Hub)
→ authenticated bot actions
→ application/API layer
→ Firebase Firestore for structured data
→ Telegram message/file references for media
→ Next.js website renderer

Kothasokhi reads the same structured WLC data and knowledge records instead of maintaining a separate hardcoded knowledge source.

## Non-negotiable architecture rules

1. Do not make Telegram directly edit website source files.
2. Do not use GitHub commits as the CMS/data transport layer.
3. Firestore is the source of truth for structured/text content.
4. Telegram is the source of truth for managed media.
5. Website pages render published Firestore content.
6. Every managed content type supports DRAFT, PUBLISHED, and ARCHIVED states.
7. Destructive actions require confirmation.
8. Admin actions are authorized by Telegram user ID and role.
9. Important mutations create audit-log records.
10. Secrets stay in environment variables; never commit tokens or credentials.

## Phase 0 — Stabilize current system

- Audit all existing Telegram album-sync routes, webhook/cron behavior, and media references.
- Verify channel/bot configuration and authorization.
- Fix media fetch failures for both Telegram and existing GitHub-backed images.
- Define deterministic media identity using Telegram chat/channel ID + message ID + media/file ID.
- Make Telegram deletion/unpublish behavior explicit and testable.
- Add structured error logging for production failures.
- Verify current Kothasokhi API and existing WLC pages before migration.

## Phase 1 — Firebase foundation

Create a Firebase project and Firestore database.

Recommended collections:

- `settings`
- `admins`
- `events`
- `members`
- `committee`
- `achievements`
- `writing`
- `announcements`
- `albums`
- `media`
- `shobdo`
- `kothasokhi_knowledge`
- `audit_logs`

Common fields:

```text
id
status: DRAFT | PUBLISHED | ARCHIVED
createdAt
updatedAt
createdBy
updatedBy
sortOrder
```

Use server-side Firebase Admin access for trusted mutations. Do not expose service credentials to the browser.

## Phase 2 — Media model

Telegram remains the media store.

A Firestore media record should keep references such as:

```text
id
telegramChatId
telegramMessageId
telegramFileId
mediaType
mimeType
caption
width
height
duration
albumId
status
createdAt
updatedAt
```

Never depend on a temporary Telegram URL as permanent storage.

For each website media item, retain enough Telegram identity to re-fetch/rebuild its delivery URL through the server-side media layer.

Define behavior for:
- new media
- album grouping
- edited captions
- deleted Telegram messages
- missing Telegram media
- replaced media
- unpublished media

## Phase 3 — Telegram Control Hub

Build an authenticated admin menu:

- 📅 Events
- 👥 Members
- 🏛 Committee
- 🏆 Achievements
- 📝 Writing
- 🖼 Albums
- 📢 Announcements
- 📚 Shobdo
- 🤖 Kothasokhi
- ⚙️ Website Settings
- 📊 Statistics
- 🧾 Audit Log

Roles:

- SUPER_ADMIN
- CONTENT_ADMIN
- MEDIA_ADMIN
- PANEL_ADMIN

Use Telegram numeric user IDs for authorization. Role checks must happen server-side for every mutation.

## Phase 4 — CRUD flows

Every module follows:

Create → Preview → Save Draft / Publish → Edit → Archive

Events:
- title
- date/time
- location
- description
- poster/media
- registration link
- status

Members:
- name
- role
- department
- bio
- social links
- profile media
- active/archive state

Committee:
- panel/year
- positions
- members
- publish/archive panel

Achievements:
- title
- description
- year/date
- related event
- media/link
- status

Writing:
- title
- author
- category
- body/excerpt
- cover media
- publish state

Announcements:
- title
- message
- CTA/link
- publish date
- expiry date
- status

Albums:
- album title
- event/category
- Telegram media references
- cover image
- caption
- publish state

## Phase 5 — Website migration

Gradually remove hardcoded CMS content from Next.js.

Create server-side data access functions such as:

```text
getEvents()
getPublishedEvents()
getMembers()
getCurrentCommittee()
getAchievements()
getWriting()
getAnnouncements()
getAlbums()
getShobdo()
getKothasokhiKnowledge()
```

Pages should consume these functions instead of importing large static arrays.

Keep layout, components, design, and static UI in code. Keep content in Firestore.

Use caching/revalidation so the website remains fast while updates from Telegram become visible quickly.

## Phase 6 — Kothasokhi

Kothasokhi should use the same WLC content database.

Knowledge sources:

1. structured Firestore content
2. curated Kothasokhi knowledge records
3. optional web search for questions that genuinely require external/current information

Keep deterministic intents out of the LLM when possible:
- events
- members
- committee
- contact
- official links
- current announcements

This reduces token usage and makes answers more reliable.

Add Telegram controls:

- add knowledge
- edit knowledge
- archive knowledge
- rebuild/test knowledge
- inspect recent questions/errors

## Phase 7 — Security

Required controls:

- Telegram user-ID allowlist
- role-based permissions
- server-side Firebase Admin SDK
- webhook secret validation
- command rate limiting
- confirmation for delete/archive actions
- audit logging
- input validation
- file/media validation
- no credentials in repository
- production error messages must not leak secrets

Use idempotency for Telegram updates so duplicate webhook delivery cannot create duplicate records.

## Phase 8 — Observability

Create a small admin statistics view through Telegram:

- published events
- active members
- albums/media count
- recent admin actions
- failed Telegram syncs
- Kothasokhi requests/errors
- last successful sync

Keep detailed audit records in Firestore.

## Phase 9 — Testing

Before switching production to the new CMS:

### Telegram
- unauthorized user
- authorized user
- duplicate update
- cancelled flow
- invalid input
- publish/draft/archive
- delete confirmation
- album with 1, 5, 10+ photos
- edited caption
- deleted Telegram media

### Firestore
- create/update/archive
- role restrictions
- malformed data
- concurrent edits

### Website
- published content appears
- drafts never appear publicly
- archived content disappears
- missing media has fallback
- empty collections render correctly
- caching/revalidation works

### Kothasokhi
- Banglish
- Bengali
- English
- known WLC facts
- unknown questions
- links
- current events
- token/cost behavior

## Phase 10 — Production migration

Migration order:

1. Backup current static content.
2. Create Firebase collections.
3. Import existing WLC content.
4. Build Telegram CRUD for one module.
5. Connect that module to the website.
6. Test production behavior.
7. Migrate remaining modules one by one.
8. Move Kothasokhi to the shared data layer.
9. Keep old static fallbacks temporarily.
10. Remove obsolete content files only after successful verification.

## Final target

After migration, the normal workflow should be:

Telegram → create/edit content → Firestore
Telegram → upload/manage media → Telegram + Firestore references
Firestore + Telegram media → Next.js website
Firestore + curated knowledge → Kothasokhi

A normal content update should NOT require:
- editing TSX files
- editing JSON/text content manually
- GitHub commits
- Vercel redeployment

## Suggested implementation order

1. Firebase foundation
2. Admin/auth model
3. Telegram Control Hub shell
4. Media/album system stabilization
5. Events
6. Members + Committee
7. Achievements
8. Writing
9. Announcements
10. Website migration
11. Kothasokhi migration
12. Audit/statistics
13. Remove legacy CMS paths
14. Production hardening

## Definition of done

The architecture is complete when a properly authorized WLC admin can manage the site's structured content and media entirely from Telegram, while the public Next.js site updates from Firebase/Telegram-backed data without requiring source-code edits or a deployment for ordinary content changes.
