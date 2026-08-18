import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CasinoIcon from "@mui/icons-material/Casino";
import ShieldIcon from "@mui/icons-material/Shield";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { HobbiesList, type HobbiesListEntry } from "./HobbiesList";

const entries: HobbiesListEntry[] = [
  {
    id: "videogames",
    label: "Videogames",
    description: "A mix of story-driven RPGs and competitive titles.",
    icon: SportsEsportsIcon,
  },
  {
    id: "tabletop",
    label: "Tabletop roleplaying",
    description: "A regular player and occasional game master.",
    icon: CasinoIcon,
  },
  {
    id: "combat",
    label: "Medieval combat and fairs",
    description: "Practices historical medieval combat.",
    icon: ShieldIcon,
  },
  {
    id: "reading",
    label: "Reading",
    description: "Mostly fantasy and sci-fi.",
    icon: MenuBookIcon,
  },
];

test("no card is expanded by default", () => {
  render(<HobbiesList entries={entries} />);

  for (const button of screen.getAllByRole("button")) {
    expect(button).toHaveAttribute("aria-expanded", "false");
  }
});

test("renders entries in declared order", () => {
  render(<HobbiesList entries={entries} />);

  const buttons = screen.getAllByRole("button");
  expect(buttons.map((button) => button.textContent)).toEqual([
    "Videogames",
    "Tabletop roleplaying",
    "Medieval combat and fairs",
    "Reading",
  ]);
});

test("highlight expands only the matching card", () => {
  render(<HobbiesList entries={entries} highlight="reading" />);

  expect(screen.getByRole("button", { name: /Videogames/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(screen.getByRole("button", { name: /Reading/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("clicking a collapsed card expands it and collapses the previous one", async () => {
  const user = userEvent.setup();
  render(<HobbiesList entries={entries} highlight="reading" />);

  await user.click(screen.getByRole("button", { name: /Tabletop/ }));

  expect(screen.getByRole("button", { name: /Reading/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(screen.getByRole("button", { name: /Tabletop/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
