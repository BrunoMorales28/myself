import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperienceList, type ExperienceListEntry } from "./ExperienceList";

const professionalEntries: ExperienceListEntry[] = [
  {
    id: "globant-sportian",
    company: "Globant (client: Sportian)",
    logoUrl: "/logos/globant.svg",
    logoAlt: "Globant logo",
    role: "React.js Developer",
    dateRange: "Nov 2025 – Jun 2026",
    description:
      "Sole front-end owner for a virtual resource management platform.",
    bullets: ["Owned front-end development end-to-end"],
    tags: ["React", "TypeScript"],
  },
];

const earlyEntries: ExperienceListEntry[] = [
  {
    id: "indra",
    company: "Indra",
    logoUrl: "/logos/indra.svg",
    logoAlt: "Indra logo",
    role: "Tester",
    dateRange: "Aug 2016 – May 2017",
    description: "Training in PL/SQL and Java programming.",
    bullets: ["Trained in PL/SQL and Java programming"],
    tags: [],
  },
];

function renderList(highlight?: string) {
  return render(
    <ExperienceList
      professionalEntries={professionalEntries}
      earlyEntries={earlyEntries}
      professionalHeading="Professional Experience"
      earlyHeading="Other experiences"
      tagsGroupLabel="Technologies used"
      highlight={highlight}
    />,
  );
}

test("renders both section headings", () => {
  renderList();

  expect(
    screen.getByRole("heading", { name: "Professional Experience", level: 2 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Other experiences", level: 2 }),
  ).toBeInTheDocument();
});

test("no card is expanded by default", () => {
  renderList();

  for (const button of screen.getAllByRole("button")) {
    expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("highlight expands the matching card even if it's in the early section", () => {
  renderList("indra");

  expect(
    screen.getByRole("button", { name: /React.js Developer/ }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("button", { name: /Tester/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("clicking a collapsed card expands it and collapses the previous one", async () => {
  const user = userEvent.setup();
  renderList("globant-sportian");

  await user.click(screen.getByRole("button", { name: /Tester/ }));

  expect(
    screen.getByRole("button", { name: /React.js Developer/ }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("button", { name: /Tester/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
