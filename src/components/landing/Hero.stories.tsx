import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Hero } from "./Hero";

const meta: Meta<typeof Hero> = {
  component: Hero,
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    name: "Bruno Morales",
    role: "Web Developer",
    intro:
      "This site is Bruno's résumé and portfolio — a working example of the frontend craft described below, built end to end and open source.",
    downloadCvLabel: "Download CV",
    downloadCvHref: "/cv.pdf",
    contactLabel: "Contact",
    contactHref: "/contact",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Bruno Morales",
      }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: "Download CV" }),
    ).toBeInTheDocument();
  },
};
