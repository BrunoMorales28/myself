import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("about page renders the bio and all four hobbies collapsed by default", async ({
  page,
}) => {
  await page.goto("/en/about");

  await expect(
    page.getByRole("heading", { name: "About", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hobbies", level: 2 }),
  ).toBeVisible();

  const cardButtons = page.locator("main button[aria-expanded]");
  await expect(cardButtons).toHaveCount(4);
  for (const button of await cardButtons.all()) {
    await expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("highlight param opens and scrolls to the matching card", async ({
  page,
}) => {
  await page.goto("/en/about?highlight=reading");

  const readingButton = page.getByRole("button", { name: /Reading/ });
  await expect(readingButton).toHaveAttribute("aria-expanded", "true");
  await expect(readingButton).toBeInViewport();

  const videogamesButton = page.getByRole("button", { name: /Videogames/ });
  await expect(videogamesButton).toHaveAttribute("aria-expanded", "false");
});

test("clicking and keyboard toggling expand/collapse a card", async ({
  page,
}) => {
  await page.goto("/en/about");

  const readingButton = page.getByRole("button", { name: /Reading/ });
  await expect(readingButton).toHaveAttribute("aria-expanded", "false");

  await readingButton.click();
  await expect(readingButton).toHaveAttribute("aria-expanded", "true");

  await readingButton.focus();
  await page.keyboard.press("Enter");
  await expect(readingButton).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Space");
  await expect(readingButton).toHaveAttribute("aria-expanded", "true");
});

for (const locale of ["en", "es"] as const) {
  test(`about page (${locale}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/about`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
