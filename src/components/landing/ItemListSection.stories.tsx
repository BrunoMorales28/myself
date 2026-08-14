import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import Avatar from "@mui/material/Avatar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { ItemListSection } from "./ItemListSection";

// A tiny inline SVG stands in for a real company logo asset (none are
// sourced yet — see spec 07) so this story can show the loaded-image state.
const sampleLogo =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#0B3D66"/></svg>',
  );

const meta: Meta<typeof ItemListSection> = {
  component: ItemListSection,
};

export default meta;
type Story = StoryObj<typeof ItemListSection>;

export const WithLogos: Story = {
  args: {
    title: "Experience",
    viewAllHref: "/experience",
    viewAllLabel: "View all experience",
    items: [
      {
        id: "globant-sportian",
        title: "React.js Developer",
        href: "/experience?highlight=globant-sportian",
        avatar: (
          <Avatar src={sampleLogo} alt="Globant logo">
            G
          </Avatar>
        ),
      },
      {
        id: "hootsuite",
        title: "React.js Developer",
        href: "/experience?highlight=hootsuite",
        avatar: <Avatar aria-label="Hootsuite logo">H</Avatar>,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: "View all experience" }),
    ).toBeInTheDocument();
  },
};

export const WithIcons: Story = {
  name: "With icon avatars (e.g. Hobbies)",
  args: {
    title: "Hobbies",
    items: [
      {
        id: "reading",
        title: "Reading",
        href: "/about?highlight=reading",
        avatar: (
          <Avatar>
            <MenuBookIcon fontSize="small" />
          </Avatar>
        ),
      },
    ],
  },
};
