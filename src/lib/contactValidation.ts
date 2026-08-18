import * as Yup from "yup";

// The single source of truth for the contact form's field shape (types,
// trimming) — the client (ContactForm) layers localized error messages
// (including its own `.email(message)` call) on top of these field
// schemas; the server (the /api/contact route) uses `contactSchema`
// directly, since API error bodies aren't localized UI text.
//
// `.email()` is deliberately NOT applied here: Yup doesn't let a later
// `.email(customMessage)` call override an earlier bare `.email()` call's
// message (confirmed empirically — the original message always wins), so
// each consumer applies its own single `.email(...)` call instead of
// layering a second one on top of a shared base.
export const nameFieldSchema = Yup.string().trim();
export const emailFieldSchema = Yup.string().trim();
export const messageFieldSchema = Yup.string().trim();

export const contactSchema = Yup.object({
  name: nameFieldSchema.required(),
  email: emailFieldSchema.email().required(),
  message: messageFieldSchema.required(),
});

export type ContactSubmission = Yup.InferType<typeof contactSchema>;
