import { test, expect } from "@playwright/test";

test("experience page renders both sections collapsed by default", async ({
  page,
}) => {
  await page.goto("/en/experience");

  await expect(
    page.getByRole("heading", { name: "Experience", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Professional Experience", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Other experiences", level: 2 }),
  ).toBeVisible();

  const cardButtons = page.locator("main button[aria-expanded]");
  await expect(cardButtons).toHaveCount(13);
  for (const button of await cardButtons.all()) {
    await expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("highlight param opens and scrolls to a professional entry", async ({
  page,
}) => {
  await page.goto("/en/experience?highlight=globant-sportian");

  const button = page.getByRole("button", { name: /Globant/ });
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(button).toBeInViewport();
});

test("highlight param opens and scrolls to an early-career entry", async ({
  page,
}) => {
  await page.goto("/en/experience?highlight=indra");

  const button = page.getByRole("button", { name: /Tester/ });
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(button).toBeInViewport();
});

test("clicking and keyboard toggling expand/collapse a card", async ({
  page,
}) => {
  await page.goto("/en/experience");

  const button = page.getByRole("button", { name: /Tester/ });
  await expect(button).toHaveAttribute("aria-expanded", "false");

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");

  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "true");
});
