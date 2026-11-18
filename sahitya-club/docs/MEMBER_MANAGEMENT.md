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

Never expose any of these values with `NEXT_PUBLIC_` prefixes.

## Workflow

1. Registration stays offline.
2. Panel/admin enters the member into `/memberhub`.
3. Firestore transaction generates a yearly Member ID such as `WLC-2026-0001`.
4. The record is stored privately in `registered_members`, separate from the public CMS `members` collection.
5. The confirmation email can be sent immediately through Resend.
6. A WhatsApp message is generated with a pre-filled `wa.me` link and copyable text.
7. Event-specific passwords can be added later without changing the permanent Member ID.

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
- createdAt / updatedAt
- createdBy

## 500+ members / future batching

The current hub supports creating and emailing members individually. For a large registration batch, add a queue-based sender rather than firing hundreds of email requests inside one Vercel request. This keeps retries and failures isolated.
