import { describe, expect, it, vi } from "vitest";

import { CONTACT_SUBJECT, isValidEmail, normalizeWebsite, submitContact } from "./contact";

const message = {
  name: "Jane",
  email: "jane@example.com",
  website: "jane.dev",
  message: "Hi there",
  subject: CONTACT_SUBJECT,
};

const answering = (status: number, body: unknown) =>
  vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }));

describe("normalizeWebsite", () => {
  it("adds https to an address typed without a protocol", () => {
    expect(normalizeWebsite("jane.dev")).toBe("https://jane.dev");
    expect(normalizeWebsite(" linkedin.com/in/jane ")).toBe("https://linkedin.com/in/jane");
  });

  it("leaves an address with a protocol, a blank and a bare word alone", () => {
    expect(normalizeWebsite("http://jane.dev")).toBe("http://jane.dev");
    expect(normalizeWebsite("HTTPS://jane.dev")).toBe("HTTPS://jane.dev");
    expect(normalizeWebsite("   ")).toBe("");
    expect(normalizeWebsite("jane")).toBe("jane");
  });
});

describe("isValidEmail", () => {
  it("accepts an address and refuses what is not one", () => {
    expect(isValidEmail("jane@example.com")).toBe(true);
    expect(isValidEmail(" jane@example.co.uk ")).toBe(true);
    expect(isValidEmail("jane")).toBe(false);
    expect(isValidEmail("jane@example")).toBe(false);
    expect(isValidEmail("ja ne@example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("submitContact", () => {
  it("posts every field with the key and a normalised website", async () => {
    const fetch = answering(200, { success: true });

    expect(await submitContact(message, { accessKey: "key", fetch })).toBe(true);

    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = init?.body as FormData;
    expect(body.get("access_key")).toBe("key");
    expect(body.get("subject")).toBe(CONTACT_SUBJECT);
    expect(body.get("name")).toBe("Jane");
    expect(body.get("email")).toBe("jane@example.com");
    expect(body.get("website")).toBe("https://jane.dev");
    expect(body.get("message")).toBe("Hi there");
  });

  it("fails on an error status, a refusal and a network error", async () => {
    expect(await submitContact(message, { accessKey: "key", fetch: answering(500, {}) })).toBe(
      false,
    );
    expect(
      await submitContact(message, { accessKey: "key", fetch: answering(200, { success: false }) }),
    ).toBe(false);
    const offline = vi.fn<typeof fetch>(async () => {
      throw new TypeError("offline");
    });
    expect(await submitContact(message, { accessKey: "key", fetch: offline })).toBe(false);
  });

  it("fails without a key and never calls out", async () => {
    const fetch = answering(200, { success: true });
    expect(await submitContact(message, { accessKey: "", fetch })).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
