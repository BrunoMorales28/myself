"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export type ContactFormLabels = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
};

export type ContactFormProps = {
  labels: ContactFormLabels;
};

type FormValues = {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot — real visitors never see or fill this
};

type ToastState = {
  open: boolean;
  severity: "success" | "error";
  message: string;
};

const FIELD_ORDER: (keyof Omit<FormValues, "website">)[] = [
  "name",
  "email",
  "message",
];

export function ContactForm({ labels }: ContactFormProps) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef };

  const validationSchema = Yup.object({
    name: Yup.string().trim().required(labels.nameRequired),
    email: Yup.string()
      .trim()
      .email(labels.emailInvalid)
      .required(labels.emailRequired),
    message: Yup.string().trim().required(labels.messageRequired),
    website: Yup.string(),
  });

  const formik = useFormik<FormValues>({
    initialValues: { name: "", email: "", message: "", website: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (values.website) {
        // Honeypot filled in — treat as spam, drop silently without a
        // network request or letting the sender know it was filtered.
        setToast({
          open: true,
          severity: "success",
          message: labels.successMessage,
        });
        setSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
          }),
        });
        if (!response.ok) {
          throw new Error("Contact submission failed");
        }
        setToast({
          open: true,
          severity: "success",
          message: labels.successMessage,
        });
        resetForm();
      } catch {
        setToast({
          open: true,
          severity: "error",
          message: labels.errorMessage,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  function handleToastClose() {
    setToast((current) => ({ ...current, open: false }));
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = await formik.validateForm();
    const firstInvalidField = FIELD_ORDER.find((field) => errors[field]);

    if (firstInvalidField) {
      await formik.setTouched({ name: true, email: true, message: true });
      fieldRefs[firstInvalidField].current?.focus();
      return;
    }

    formik.handleSubmit(event);
  }

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      noValidate
      sx={{ maxWidth: 480 }}
    >
      <Stack spacing={2}>
        <TextField
          id="contact-name"
          name="name"
          label={labels.nameLabel}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          inputRef={nameRef}
          fullWidth
        />
        <TextField
          id="contact-email"
          name="email"
          type="email"
          label={labels.emailLabel}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          inputRef={emailRef}
          fullWidth
        />
        <TextField
          id="contact-message"
          name="message"
          label={labels.messageLabel}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
          inputRef={messageRef}
          multiline
          minRows={4}
          fullWidth
        />

        {/* Honeypot: visually hidden, never reachable by keyboard, and
            invisible to sighted users — real visitors never interact with
            it, so a non-empty value on submit signals an automated bot. */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
          }}
        >
          <TextField
            id="contact-website"
            name="website"
            label="Website"
            value={formik.values.website}
            onChange={formik.handleChange}
            slotProps={{
              htmlInput: { tabIndex: -1, autoComplete: "off" },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{ alignSelf: "flex-start" }}
        >
          {formik.isSubmitting ? labels.submittingLabel : labels.submitLabel}
        </Button>
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={handleToastClose}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
