# QuickBill

**Speak it. Send it. Get paid.**

AI-powered invoicing and trust engine for African micro-enterprises, freelancers, and SMEs. Generate a professional, branded invoice from a single spoken or typed sentence — verified, shareable, and payable in seconds.

Built for the **WeTech × NexaScale AI Vibe Coding Hackathon — Power Shift** (For Profit & Industry track).

---

## The problem

Nigeria's 39M+ MSMEs still bill through slow, manual processes — invoices written by hand or typed inconsistently, often taking significant time and inviting costly errors. Even once an invoice is sent, buyers frequently hesitate to pay it, because there's no easy way to confirm the vendor is a legitimate, registered business. Billing friction and lack of trust combine to delay — or kill — the sale.

## The solution

QuickBill turns one natural-language prompt into a ready-to-send invoice:

1. **Speak or type** — e.g. *"Bill Chief Okafor 45k for 3 bags of rice delivered today, plus 5k delivery fee. Due in 2 days."*
2. **AI extracts** the client, line items, quantities, and totals — normalising shorthand amounts and relative dates into structured, accurate values.
3. **Brand locks in** — the invoice renders in the merchant's saved logo, colours, and template every time.
4. **Trust + pay** — a CAC-verification badge confirms the business is registered, alongside a shareable link and payment option, delivered straight to WhatsApp or email.

## Features

- 🎙️ Natural-language invoice creation (voice or text input)
- 🤖 AI-powered parsing via Google Gemini — line items, quantities, currency shorthand, relative due dates
- 🎨 Persistent per-merchant branding (logo, colours, template)
- ✅ CAC verification badge with an admin-reviewed approval workflow
- 🔗 Shareable public invoice links
- 💬 One-tap send to WhatsApp / email
- 💳 Integrated payment link

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Framer Motion, Lucide icons |
| Backend | Express (TypeScript), served alongside the frontend via a single `server.ts` |
| AI | Google Gemini API (`@google/genai`) |
| Validation | Zod |
| Storage | File-based storage under a configurable `DATA_DIR` |
| Package manager | Bun (with npm-compatible scripts) |

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 18+) installed
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### Setup

```bash
# Clone the repo
git clone https://github.com/Pyemmy/QUICKBILL-M-CORD.git
cd QUICKBILL-M-CORD

# Install dependencies
bun install
# or: npm install

# Configure environment variables
cp .env.example .env
```

Fill in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:5173
ADMIN_EMAILS=your_admin_email@example.com
DATA_DIR=data
PARSER_SERVICE_URL=
```

### Run locally

```bash
bun run dev
```

This runs `server.ts` via `tsx`, serving both the API and the Vite frontend.

### Build for production

```bash
bun run build
bun run start
```

`build` compiles the frontend with Vite and bundles the server with esbuild into `dist/server.cjs`; `start` runs the bundled server.

## Environment variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Required — used for AI-powered invoice parsing |
| `APP_URL` | The URL the app is hosted at (self-referential links, callbacks) |
| `ADMIN_EMAILS` | Comma-separated list of admins authorized to review CAC verification requests |
| `DATA_DIR` | Directory for persistent file-based storage (e.g. a Render disk mount) |
| `PARSER_SERVICE_URL` | Optional external parser endpoint; falls back to Gemini if unset or unreachable |

## Roadmap

- **Phase 2:** Automated CAC verification (Youverify / Smile ID), Paystack escrow, multi-channel payment reminders
- **Phase 3:** Cash-flow forecasting, invoice-history-backed working-capital lending, cross-border invoicing (USD, GBP, EUR)

## Team

Built by **Dein** (Team Lead / Fullstack), **Celine** (Backend), **Rita** (AI Service), **Mercy** (Frontend), and **Opeyemi** (Product Design).

## License

Built for hackathon submission — license TBD.
