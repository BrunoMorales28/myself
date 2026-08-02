import type { HttpHandler } from "msw";

// Real handlers get added here per feature that needs API mocking
// (e.g. contact form, chatbot).
export const handlers: HttpHandler[] = [];
