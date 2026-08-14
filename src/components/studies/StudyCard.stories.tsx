import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import { StudyCard } from "./StudyCard";

// A tiny inline SVG stands in for a real company logo asset.
const sampleLogo =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#0B3D66"/></svg>',
  );

const meta: Meta<typeof StudyCard> = {
  component: StudyCard,
  args: {
    id: "digital-house",
    institution: "Digital House",
    logoUrl: sampleLogo,
    logoAlt: "Digital House logo",
    degree: "Native Android Development",
    dateRange: "Mar 2016 – Sep 2016",
    description:
      "Intensive course covering native Android app development, from UI fundamentals to publishing on the Play Store.",
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof StudyCard>;

export const Collapsed: Story = {
  args: { expanded: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Digital House/ });
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
};

export const Expanded: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: /Digital House/ }),
    ).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByText(/Intensive course covering/),
    ).toBeInTheDocument();
  },
};

export const LogoFallback: Story = {
  name: "Logo fallback (broken/missing logoUrl)",
  args: { expanded: false, logoUrl: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("DH")).toBeInTheDocument();
  },
};
