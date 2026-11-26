# Nova Study

AI study companion (Thai-first): upload PDF/image/text → summary, quiz, flashcards, Q&A; Pro plan adds detailed summaries and reports. Next.js 16 · Supabase · Gemini · Stripe.

## Launch checklist

1. **Supabase**: create a project, run `supabase/schema.sql`, then `supabase/migration_002_monetization.sql` in the SQL editor.
   Auth → URL Configuration: set Site URL to your domain and add `https://your-domain.com/auth/callback` to Redirect URLs.
2. **Env vars**: copy `.env.example` → `.env.local` (and set the same on your host, e.g. Vercel).
3. **Stripe**:
   - Add a webhook endpoint `https://your-domain.com/api/stripe/webhook` with events
     `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.paid`, `invoice.payment_succeeded`; copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
   - Enable the **Customer Portal** (Settings → Billing → Customer portal) so users can cancel / change card.
   - Test locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
4. **Gemini**: set `GEMINI_API_KEY`. Pro-only actions use `GEMINI_PRO_MODEL`.
5. Edit pricing/limits in `src/lib/plans.ts`; fill in your contact email in `NEXT_PUBLIC_SUPPORT_EMAIL`.
6. Have a lawyer/accountant review `/terms` and `/privacy` before charging real customers.

```bash
npm install
npm run dev
```
