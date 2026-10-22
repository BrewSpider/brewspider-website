// One-off: send the double opt-in email to signups made before the Brevo link existed.
// Export the "launch-list" CSV from Netlify (Forms -> launch-list -> Download as CSV), then
//   BREVO_API_KEY=... BREVO_LIST_ID=... BREVO_DOI_TEMPLATE_ID=... node tools/brevo-backfill.mjs launch-list.csv
// Add --dry-run to only list the addresses. Each address gets one confirmation email.
import { readFileSync } from "node:fs";
import { addToLaunchList } from "../netlify/functions/submission-created.mjs";

const file = process.argv.find((a) => a.endsWith(".csv"));
const dry = process.argv.includes("--dry-run");
if (!file) throw new Error("usage: node tools/brevo-backfill.mjs <export.csv> [--dry-run]");

// Email addresses can't hold commas or quotes, so a plain pattern finds them in any column.
const found = readFileSync(file, "utf8").match(/[^\s",;<>]+@[^\s",;<>]+\.[a-z]{2,}/gi) || [];
const emails = [...new Set(found.map((e) => e.toLowerCase()))];

for (const email of emails) {
  console.log(email, dry ? "(dry run)" : await addToLaunchList(email));
}
