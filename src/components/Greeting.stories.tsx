import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Greeting } from "./Greeting";

const meta: Meta<typeof Greeting> = {
  component: Greeting,
};

export default meta;
type Story = StoryObj<typeof Greeting>;

export const Default: Story = {
  args: {
    name: "Bruno",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Hello, Bruno!")).toBeInTheDocument();
  },
};
