import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("studies page renders both entries collapsed by default", async ({
  page,
}) => {
  await page.goto("/en/studies");

  await expect(
    page.getByRole("heading", { name: "Studies", level: 1 }),
  ).toBeVisible();

  const cardButtons = page.locator("main button[aria-expanded]");
  await expect(cardButtons).toHaveCount(2);
  for (const button of await cardButtons.all()) {
    await expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("highlight param opens and scrolls to the matching card", async ({
  page,
}) => {
  await page.goto("/en/studies?highlight=digital-house");

  const digitalHouseButton = page.getByRole("button", {
    name: /Digital House/,
  });
  await expect(digitalHouseButton).toHaveAttribute("aria-expanded", "true");
  await expect(digitalHouseButton).toBeInViewport();

  const ortButton = page.getByRole("button", { name: /Escuelas Técnicas ORT/ });
  await expect(ortButton).toHaveAttribute("aria-expanded", "false");
});

test("clicking and keyboard toggling expand/collapse a card", async ({
  page,
}) => {
  await page.goto("/en/studies");

  const ortButton = page.getByRole("button", { name: /Escuelas Técnicas ORT/ });
  await expect(ortButton).toHaveAttribute("aria-expanded", "false");

  await ortButton.click();
  await expect(ortButton).toHaveAttribute("aria-expanded", "true");

  await ortButton.focus();
  await page.keyboard.press("Enter");
  await expect(ortButton).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Space");
  await expect(ortButton).toHaveAttribute("aria-expanded", "true");
});

for (const locale of ["en", "es"] as const) {
  test(`studies page (${locale}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/studies`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
