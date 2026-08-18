import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CasinoIcon from "@mui/icons-material/Casino";
import ShieldIcon from "@mui/icons-material/Shield";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { HobbyCard } from "./HobbyCard";

const meta: Meta<typeof HobbyCard> = {
  component: HobbyCard,
  args: {
    id: "reading",
    label: "Reading",
    description:
      "Mostly fantasy and sci-fi, with the occasional non-fiction book about how things — or people — actually work.",
    icon: MenuBookIcon,
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof HobbyCard>;

export const Collapsed: Story = {
  args: { expanded: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Reading/ });
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
};

export const Expanded: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: /Reading/ }),
    ).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Mostly fantasy/)).toBeInTheDocument();
  },
};

export const Videogames: Story = {
  args: { id: "videogames", label: "Videogames", icon: SportsEsportsIcon },
};

export const Tabletop: Story = {
  args: { id: "tabletop", label: "Tabletop roleplaying", icon: CasinoIcon },
};

export const MedievalCombat: Story = {
  args: {
    id: "combat",
    label: "Medieval combat and fairs",
    icon: ShieldIcon,
  },
};
