import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

jest.mock("../../i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

test("renders the title, intro, and both CTAs", () => {
  render(
    <Hero
      title="Bruno Morales — Web Developer"
      intro="This site is Bruno's résumé and portfolio."
      downloadCvLabel="Download CV"
      downloadCvHref="/cv.pdf"
      contactLabel="Contact"
      contactHref="/contact"
    />,
  );

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Bruno Morales — Web Developer",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("This site is Bruno's résumé and portfolio."),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
    "href",
    "/cv.pdf",
  );
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
    "href",
    "/contact",
  );
});
