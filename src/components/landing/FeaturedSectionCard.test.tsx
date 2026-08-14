import { render, screen } from "@testing-library/react";
import { FeaturedSectionCard } from "./FeaturedSectionCard";

jest.mock("../../i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

test("renders the title and description behind a link to the section", () => {
  render(
    <FeaturedSectionCard
      title="Skills"
      description="React and TypeScript, among others."
      href="/skills"
    />,
  );

  expect(screen.getByText("Skills")).toBeInTheDocument();
  expect(
    screen.getByText("React and TypeScript, among others."),
  ).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/skills");
});
