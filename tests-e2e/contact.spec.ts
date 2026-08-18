import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("contact page renders heading, direct links, and the form", async ({
  page,
}) => {
  await page.goto("/en/contact");

  await expect(
    page.getByRole("heading", { name: "Contact", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "morales.bruno.95@gmail.com" }),
  ).toHaveAttribute("href", "mailto:morales.bruno.95@gmail.com");
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    /linkedin\.com/,
  );
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", "https://github.com/BrunoMorales28");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Message")).toBeVisible();
});

test("submitting an empty form shows field errors and focuses the first invalid field", async ({
  page,
}) => {
  await page.goto("/en/contact");

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(
    page.getByText("Please enter your email address."),
  ).toBeVisible();
  await expect(page.getByText("Please enter a message.")).toBeVisible();
  await expect(page.getByLabel("Name")).toBeFocused();
});

test("submitting a valid form against a backend with no database configured shows an error toast and preserves values", async ({
  page,
}) => {
  // This environment has no real POSTGRES_URL, so the route's DB call
  // fails and it returns a generic 500 — the same client-visible outcome
  // as the route not existing at all, which is what this test originally
  // covered before spec 16 built the route. See spec 16's Decisions for
  // why true end-to-end success isn't verifiable in this environment.
  await page.goto("/en/contact");

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Message").fill("Let's build something.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(
    page.getByRole("alert").filter({
      hasText: "Something went wrong sending your message. Please try again.",
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Ada Lovelace");
  await expect(page.getByLabel("Email")).toHaveValue("ada@example.com");
  await expect(page.getByLabel("Message")).toHaveValue(
    "Let's build something.",
  );
});

test("POST /api/contact rejects an invalid body with 400 and a structured error", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: { name: "", email: "not-an-email", message: "" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ field: "name" }),
      expect.objectContaining({ field: "email" }),
      expect.objectContaining({ field: "message" }),
    ]),
  );
});

test("POST /api/contact returns a safe 500 (no leaked details) when the database call fails", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Let's build something.",
    },
  });

  expect(response.status()).toBe(500);
  const body = await response.json();
  expect(JSON.stringify(body)).not.toMatch(/postgres|password|connection/i);
});

for (const locale of ["en", "es"] as const) {
  test(`contact page (${locale}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/contact`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
