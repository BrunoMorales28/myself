import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ContactForm, type ContactFormLabels } from "./ContactForm";

const labels: ContactFormLabels = {
  nameLabel: "Name",
  emailLabel: "Email",
  messageLabel: "Message",
  nameRequired: "Please enter your name.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  messageRequired: "Please enter a message.",
  submitLabel: "Send message",
  submittingLabel: "Sending…",
  successMessage: "Thanks — your message has been sent.",
  errorMessage: "Something went wrong sending your message. Please try again.",
};

const meta: Meta<typeof ContactForm> = {
  component: ContactForm,
  args: { labels },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {};

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /send message/i }),
    );
    await expect(
      canvas.getByText("Please enter your name."),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText("Name")).toHaveFocus();
  },
};

export const InvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Email"), "not-an-email");
    await userEvent.click(
      canvas.getByRole("button", { name: /send message/i }),
    );
    await expect(
      canvas.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  },
};
