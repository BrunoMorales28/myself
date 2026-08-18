import * as Yup from "yup";
import { contactSchema } from "@/lib/contactValidation";
import { getDb } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let submission: Yup.InferType<typeof contactSchema>;
  try {
    submission = await contactSchema.validate(body, { abortEarly: false });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.map((issue) => ({
        field: issue.path,
        message: issue.message,
      }));
      return Response.json({ errors }, { status: 400 });
    }
    throw error;
  }

  try {
    await getDb().insert(contactSubmissions).values(submission);
  } catch (error) {
    console.error("Failed to insert contact submission:", error);
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
