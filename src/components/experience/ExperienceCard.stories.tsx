import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import { ExperienceCard } from "./ExperienceCard";

// A tiny inline SVG stands in for a real company logo asset.
const sampleLogo =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#0B3D66"/></svg>',
  );

const meta: Meta<typeof ExperienceCard> = {
  component: ExperienceCard,
  args: {
    id: "globant-sportian",
    company: "Globant (client: Sportian)",
    logoUrl: sampleLogo,
    logoAlt: "Globant logo",
    role: "React.js Developer",
    dateRange: "Nov 2025 – Jun 2026",
    description:
      "Sole front-end owner for a virtual resource management platform, defining data products, domains, and accounts.",
    bullets: [
      "Owned front-end development end-to-end as the only front-end developer on the project",
      "First hands-on experience coding with AI-assisted tools",
    ],
    tags: ["React", "TypeScript", "AI-assisted development"],
    tagsGroupLabel: "Technologies used",
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ExperienceCard>;

export const Collapsed: Story = {
  args: { expanded: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /React.js Developer/ });
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
};

export const ExpandedWithTags: Story = {
  name: "Expanded (with tags)",
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: /React.js Developer/ }),
    ).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Sole front-end owner/)).toBeInTheDocument();
    await expect(
      canvas.getByRole("group", { name: "Technologies used" }),
    ).toBeInTheDocument();
  },
};

export const ExpandedNoTags: Story = {
  name: "Expanded (no tags)",
  args: {
    expanded: true,
    company: "Centerplate",
    role: "General Resort Worker (Work & Travel)",
    dateRange: "Dec 2014 – Mar 2015",
    description: "Work & Travel program at Centerplate's ski resort.",
    bullets: ["Assisted customers in the rental sector"],
    tags: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("group")).not.toBeInTheDocument();
  },
};

export const LogoFallback: Story = {
  name: "Logo fallback (broken/missing logoUrl)",
  args: { expanded: false, logoUrl: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("G")).toBeInTheDocument();
  },
};
