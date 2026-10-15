# WLC Member Management

The private Member Hub lives at:

- `/memberhub`

## Environment variables

Required for the private browser session:

- `CONTROL_GATEWAY_KEY` (already used by the protected control gateway), or
- `MEMBER_ADMIN_GATEWAY_KEY` (preferred dedicated key)

Email sending uses:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — a verified sender, for example `Willes Literary Club <noreply@wlc.pro.bd>`

Google Sheets sync uses:

- `WLC_MEMBER_SHEET_ID` — the spreadsheet ID from its URL (the part between `/d/` and `/edit`)
- `WLC_MEMBER_SHEET_RANGE` — optional range, defaults to `Members!A:D`

The sync helper uses the existing server-only `FIREBASE_SERVICE_ACCOUNT_JSON` to authorize with Google. In the Google Cloud project for that service account, enable the Google Sheets API and share the target spreadsheet with the service account's `client_email` as an Editor. Do not expose any of these values with `NEXT_PUBLIC_` prefixes, and never commit credentials.

## Workflow

1. Registration stays offline.
2. Panel/admin enters the member into `/memberhub`.
3. Firestore transaction generates a Member ID such as `WLC-03-001`.
4. The record is stored privately in `registered_members`, separate from the public CMS `members` collection.
5. The member's ID, name, phone, and email are automatically mirrored to Google Sheets. The expected header row is `Member ID | Name | Phone | Email`.
6. Firebase remains the source of truth. If Sheets is temporarily unavailable or not configured, the member registration and existing email flow continue; the record is marked `PENDING` for sheet sync.
7. An authenticated admin can retry pending rows by sending a POST request to `/api/memberhub/sheets/sync` while logged into MemberHub.
8. The confirmation email can be sent immediately through Resend.
9. A WhatsApp message is generated with a pre-filled `wa.me` link and copyable text.

The sync checks the Member ID column before appending, to avoid duplicate rows when retrying.

## Data fields

- name
- phone
- email
- batch
- notes
- memberId
- status
- emailStatus
- emailSentAt
- emailMessageId
- spreadsheetSyncStatus / spreadsheetSyncUpdatedAt / spreadsheetSyncError
- createdAt / updatedAt
- createdBy

## 500+ members / future batching

The current hub supports creating and emailing members individually. For a large registration batch, add a queue-based sender rather than firing hundreds of email requests inside one Vercel request. This keeps retries and failures isolated.
