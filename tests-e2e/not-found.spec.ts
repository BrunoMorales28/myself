import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("unmatched path under a locale renders the themed 404 inside the page shell", async ({
  page,
}) => {
  await page.goto("/en/nonexistent");

  await expect(
    page.getByRole("heading", { name: "Page not found", level: 1 }),
  ).toBeVisible();
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("nav")).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await expect(page).toHaveURL(/\/en$/);
});

test("unmatched path under the ES locale renders the localized 404", async ({
  page,
}) => {
  await page.goto("/es/nonexistent");

  await expect(
    page.getByRole("heading", { name: "Página no encontrada", level: 1 }),
  ).toBeVisible();
});

test("a path that never reaches the locale middleware renders the bilingual root 404", async ({
  page,
}) => {
  await page.goto("/whatever.json");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Page not found",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Página no encontrada",
  );
  await expect(
    page.getByRole("link", { name: /home \(en\)/i }),
  ).toHaveAttribute("href", "/en");
  await expect(
    page.getByRole("link", { name: /inicio \(es\)/i }),
  ).toHaveAttribute("href", "/es");
});

for (const locale of ["en", "es"] as const) {
  test(`404 page (${locale}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/nonexistent`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
