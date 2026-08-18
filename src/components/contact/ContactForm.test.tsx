import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
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

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Message"), "Let's build something.");
}

test("shows field-level errors and focuses the first invalid field on empty submit", async () => {
  const user = userEvent.setup();
  render(<ContactForm labels={labels} />);

  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText("Please enter your name."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Please enter your email address."),
  ).toBeInTheDocument();
  expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
  expect(screen.getByLabelText("Name")).toHaveFocus();
});

test("shows an invalid-email error without submitting", async () => {
  const user = userEvent.setup();
  render(<ContactForm labels={labels} />);

  await user.type(screen.getByLabelText("Email"), "not-an-email");
  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText("Please enter a valid email address."),
  ).toBeInTheDocument();
});

test("shows a success message after a successful submission", async () => {
  server.use(http.post("/api/contact", () => HttpResponse.json({ ok: true })));
  const user = userEvent.setup();
  render(<ContactForm labels={labels} />);

  await fillValidForm(user);
  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText("Thanks — your message has been sent."),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Name")).toHaveValue("");
  expect(screen.getByLabelText("Email")).toHaveValue("");
  expect(screen.getByLabelText("Message")).toHaveValue("");
});

test("shows an error message and preserves field values when the request fails", async () => {
  server.use(
    http.post("/api/contact", () => HttpResponse.json({}, { status: 500 })),
  );
  const user = userEvent.setup();
  render(<ContactForm labels={labels} />);

  await fillValidForm(user);
  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText(
      "Something went wrong sending your message. Please try again.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
  expect(screen.getByLabelText("Email")).toHaveValue("ada@example.com");
  expect(screen.getByLabelText("Message")).toHaveValue(
    "Let's build something.",
  );
});

test("a filled honeypot field shows success without making a request", async () => {
  let requestMade = false;
  server.use(
    http.post("/api/contact", () => {
      requestMade = true;
      return HttpResponse.json({ ok: true });
    }),
  );
  const user = userEvent.setup();
  const { container } = render(<ContactForm labels={labels} />);

  await fillValidForm(user);
  const honeypot =
    container.querySelector<HTMLInputElement>("#contact-website");
  expect(honeypot).not.toBeNull();
  await user.type(honeypot!, "http://spam.example");
  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText("Thanks — your message has been sent."),
  ).toBeInTheDocument();
  expect(requestMade).toBe(false);
});
