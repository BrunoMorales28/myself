import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SkillCategorySection } from "./SkillCategorySection";

const meta: Meta<typeof SkillCategorySection> = {
  component: SkillCategorySection,
  args: {
    category: "Frontend Core",
    items: ["React.js", "TypeScript", "JavaScript (ES6+)", "Redux", "Next.js"],
    itemsGroupLabel: "Frontend Core skills",
  },
};

export default meta;
type Story = StoryObj<typeof SkillCategorySection>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Frontend Core" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("group", { name: "Frontend Core skills" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("React.js")).toBeInTheDocument();
  },
};
