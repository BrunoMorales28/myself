import { test, expect } from "@playwright/test";

for (const locale of ["en", "es"] as const) {
  test(`/${locale}/cv.pdf returns a well-formed, localized PDF`, async ({
    request,
  }) => {
    const response = await request.get(`/${locale}/cv.pdf`);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
    expect(response.headers()["content-disposition"]).toContain(
      `bruno-morales-cv-${locale}.pdf`,
    );

    const body = await response.body();
    expect(body.subarray(0, 5).toString("utf-8")).toBe("%PDF-");
    expect(body.byteLength).toBeGreaterThan(1000);
  });
}

test("landing page's Download CV button points at the current locale's PDF", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("link", { name: /download cv/i }),
  ).toHaveAttribute("href", "/en/cv.pdf");

  await page.goto("/es");
  await expect(
    page.getByRole("link", { name: /descargar cv/i }),
  ).toHaveAttribute("href", "/es/cv.pdf");
});
