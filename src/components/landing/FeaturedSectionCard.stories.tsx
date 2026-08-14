import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FeaturedSectionCard } from "./FeaturedSectionCard";

const meta: Meta<typeof FeaturedSectionCard> = {
  component: FeaturedSectionCard,
};

export default meta;
type Story = StoryObj<typeof FeaturedSectionCard>;

export const Default: Story = {
  args: {
    title: "Skills",
    description: "Frontend Core and Testing, among others.",
    href: "/skills",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", { name: /Skills/ }),
    ).toBeInTheDocument();
  },
};
