import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudiesList, type StudiesListEntry } from "./StudiesList";

const entries: StudiesListEntry[] = [
  {
    id: "digital-house",
    institution: "Digital House",
    logoUrl: "/logos/digital-house.svg",
    logoAlt: "Digital House logo",
    degree: "Native Android Development",
    dateRange: "Mar 2016 – Sep 2016",
    description: "Intensive course covering native Android app development.",
  },
  {
    id: "escuelas-tecnicas-ort",
    institution: "Escuelas Técnicas ORT",
    logoUrl: "/logos/ort.svg",
    logoAlt: "Escuelas Técnicas ORT logo",
    degree: "Technical Baccalaureate",
    dateRange: "Mar 2009 – Dec 2013",
    description: "Secondary education with a technical orientation.",
  },
];

test("no card is expanded by default", () => {
  render(<StudiesList entries={entries} />);

  for (const button of screen.getAllByRole("button")) {
    expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("highlight expands only the matching card", () => {
  render(<StudiesList entries={entries} highlight="escuelas-tecnicas-ort" />);

  expect(screen.getByRole("button", { name: /Digital House/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(
    screen.getByRole("button", { name: /Escuelas Técnicas ORT/ }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("clicking a collapsed card expands it and collapses the previous one", async () => {
  const user = userEvent.setup();
  render(<StudiesList entries={entries} highlight="digital-house" />);

  await user.click(
    screen.getByRole("button", { name: /Escuelas Técnicas ORT/ }),
  );

  expect(screen.getByRole("button", { name: /Digital House/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(
    screen.getByRole("button", { name: /Escuelas Técnicas ORT/ }),
  ).toHaveAttribute("aria-expanded", "true");
});
