import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperienceCard } from "./ExperienceCard";

function renderCard(
  expanded: boolean,
  onToggle = jest.fn(),
  overrides: Partial<React.ComponentProps<typeof ExperienceCard>> = {},
) {
  return {
    onToggle,
    ...render(
      <ExperienceCard
        id="globant-sportian"
        company="Globant (client: Sportian)"
        logoUrl="/logos/globant.svg"
        logoAlt="Globant logo"
        role="React.js Developer"
        dateRange="Nov 2025 – Jun 2026"
        description="Sole front-end owner for a virtual resource management platform."
        bullets={[
          "Owned front-end development end-to-end",
          "First hands-on experience coding with AI-assisted tools",
        ]}
        tags={["React", "TypeScript", "AI-assisted development"]}
        tagsGroupLabel="Technologies used"
        expanded={expanded}
        onToggle={onToggle}
        {...overrides}
      />,
    ),
  };
}

test("collapsed card reports aria-expanded=false", () => {
  renderCard(false);

  expect(
    screen.getByRole("button", { name: /React.js Developer/ }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("expanded card shows description, bullets, and tags", () => {
  renderCard(true);

  expect(
    screen.getByRole("button", { name: /React.js Developer/ }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/Sole front-end owner/)).toBeInTheDocument();
  expect(
    screen.getByText("Owned front-end development end-to-end"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: "Technologies used" }),
  ).toBeInTheDocument();
  expect(screen.getByText("React")).toBeInTheDocument();
});

test("clicking the header calls onToggle with the card's id", async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  renderCard(false, onToggle);

  await user.click(screen.getByRole("button", { name: /React.js Developer/ }));

  expect(onToggle).toHaveBeenCalledWith("globant-sportian");
});

test("renders initials fallback when the logo has no src", () => {
  renderCard(false, jest.fn(), {
    logoUrl: "",
    company: "Santander Tecnología",
  });

  expect(screen.getByText("ST")).toBeInTheDocument();
});

test("omits the tags group when an entry has no tags", () => {
  renderCard(true, jest.fn(), { tags: [] });

  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});
