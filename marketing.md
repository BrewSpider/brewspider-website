# Launch list: setup and how to use it

Signups on the site (hero and bottom forms, Netlify form `launch-list`) are stored in Netlify Forms
and sent on to Brevo by `netlify/functions/submission-created.mjs`. Brevo emails a confirmation link
(double opt-in); only confirmed addresses land on the list. Not part of the published site.

## One-time setup
1. Brevo -> Contacts -> Lists: create **Launch list**. Note its ID (the number in the list's URL).
2. Brevo -> Templates: create a **double opt-in** template (Brevo's own "Double opt-in" layout is fine).
   Sender `support@brewspider.com` (domain already authenticated for the login codes). The button
   must use the `{{ doubleoptin }}` link.
3. Brevo -> SMTP & API -> API keys: a new key only for the website (name it `website-launch-list`).
4. Netlify -> Site configuration -> Environment variables, scope Functions, all deploy contexts:
   `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`. Redeploy after adding them.
5. Earlier signups (before this existed): Netlify -> Forms -> launch-list -> Download as CSV, then
   `node tools/brevo-backfill.mjs launch-list.csv --dry-run`, check the list, run again without
   `--dry-run` (same env variables as above). Each gets one confirmation email.

Without the variables the function only logs "not configured"; signups are still kept in Netlify.
Function logs: Netlify -> Logs -> Functions -> submission-created.

## Using the list
- **Welcome**: Brevo -> Automations -> "Contact added to list" (Launch list) -> one short email:
  what BrewSpider is, where it is on the path to release, reply if you have questions.
- **Updates**: only at real milestones from the roadmap (prototype tested, CE done, pre-order date).
  At most about one a month; short, with one photo and one link back to the site.
- **Pre-orders**: tell the list first, a few days before anyone else (early access window, or a
  small launch-list perk if one is decided). This is the main reason the list exists.
- **Ask them**: one email with a 2-3 question survey (fermenter type, heating/cooling now, which
  brewing app) helps choose plugs, fittings and integrations, and keeps people engaged.
- Brevo free plan: unlimited contacts, 300 emails a day: send big campaigns in batches or upgrade
  for that month.
- Every Brevo campaign has an unsubscribe link automatically; don't remove it.
- Privacy promise (legal.md): the list is deleted no later than 12 months after pre-orders open.
  Any new use (e.g. a newsletter after launch) needs a new opt-in.
