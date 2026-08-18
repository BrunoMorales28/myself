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

test("submitting a valid form against the not-yet-built backend shows an error toast and preserves values", async ({
  page,
}) => {
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
