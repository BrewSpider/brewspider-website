// Netlify runs this for every verified (non-spam) form submission. Launch-list signups are
// sent on to Brevo, which emails a confirmation link (double opt-in) and adds the address to
// the launch list once it's clicked. The submission stays in Netlify Forms either way, so a
// Brevo problem is only logged: nothing is lost and the visitor still sees "thanks".
// Settings (Netlify environment variables): BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID.

const SITE = "https://brewspider.com";

export async function addToLaunchList(email, env = process.env, send = fetch) {
  const { BREVO_API_KEY: key, BREVO_LIST_ID: list, BREVO_DOI_TEMPLATE_ID: template } = env;
  if (!key || !list || !template) return "not configured";
  const r = await send("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      includeListIds: [Number(list)],
      templateId: Number(template),
      redirectionUrl: SITE + "/confirmed/"
    })
  });
  return r.ok ? "sent" : "Brevo " + r.status + ": " + (await r.text());
}

export async function handler(event) {
  const p = JSON.parse(event.body || "{}").payload || {};
  const email = ((p.data && p.data.email) || "").trim();
  if (p.form_name == "launch-list" && email) {
    try {
      const result = await addToLaunchList(email);
      if (result != "sent") console.error("launch list:", result);
    } catch (e) {
      console.error("launch list:", e);
    }
  }
  return { statusCode: 200 };
}
