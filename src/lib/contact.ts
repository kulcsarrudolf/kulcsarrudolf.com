/**
 * Leaving a message: the rules the contact form and the terminal's
 * `send-message` both follow, and the one request that delivers it. Web3Forms
 * is called straight from the browser, so its access key is a public one.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

export const CONTACT_SUBJECT = "New message from kulcsarrudolf.com";

export interface ContactMessage {
  name: string;
  email: string;
  website?: string;
  message: string;
  /** The email's subject, which is how a message says where it was written. */
  subject: string;
}

/** Adds `https://` to what looks like an address typed without one. */
export function normalizeWebsite(value: string): string {
  const website = value.trim();
  if (!website || /^https?:\/\//i.test(website)) return website;
  return website.includes(".") || website.includes("/") ? `https://${website}` : website;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Something, an @, something, a dot, something: the check a form field makes. */
export const isValidEmail = (value: string): boolean => EMAIL.test(value.trim());

interface SubmitOptions {
  accessKey?: string;
  fetch?: typeof fetch;
}

/** Sends the message. True only when Web3Forms says it arrived; it never throws. */
export async function submitContact(
  message: ContactMessage,
  options: SubmitOptions = {},
): Promise<boolean> {
  const accessKey = options.accessKey ?? import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return false;

  const body = new FormData();
  body.append("access_key", accessKey);
  body.append("subject", message.subject);
  body.append("name", message.name);
  body.append("email", message.email);
  body.append("website", normalizeWebsite(message.website ?? ""));
  body.append("message", message.message);

  try {
    const response = await (options.fetch ?? fetch)(ENDPOINT, { method: "POST", body });
    if (!response.ok) return false;
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
