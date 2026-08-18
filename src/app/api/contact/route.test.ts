const mockValues = jest.fn();
const mockInsert = jest.fn(() => ({ values: mockValues }));
const mockGetDb = jest.fn(() => ({ insert: mockInsert }));

jest.mock("../../../lib/db/client", () => ({
  getDb: () => mockGetDb(),
}));

import { POST } from "./route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockValues.mockReset().mockResolvedValue(undefined);
  mockInsert.mockClear();
  mockGetDb.mockClear();
});

test("inserts a valid submission and returns 201", async () => {
  const response = await POST(
    makeRequest({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Let's build something.",
    }),
  );

  expect(response.status).toBe(201);
  expect(mockGetDb).toHaveBeenCalledTimes(1);
  expect(mockInsert).toHaveBeenCalledTimes(1);
  expect(mockValues).toHaveBeenCalledWith({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Let's build something.",
  });
});

test("rejects an invalid body with 400 and does not touch the database", async () => {
  const response = await POST(
    makeRequest({ name: "", email: "not-an-email", message: "" }),
  );
  const json = await response.json();

  expect(response.status).toBe(400);
  expect(json.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ field: "name" }),
      expect.objectContaining({ field: "email" }),
      expect.objectContaining({ field: "message" }),
    ]),
  );
  expect(mockGetDb).not.toHaveBeenCalled();
});

test("rejects a malformed JSON body with 400", async () => {
  const request = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });

  const response = await POST(request);

  expect(response.status).toBe(400);
  expect(mockGetDb).not.toHaveBeenCalled();
});

test("returns a generic 500 without leaking details when the database call fails", async () => {
  mockValues.mockReset().mockRejectedValue(new Error("connection refused"));

  const response = await POST(
    makeRequest({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Let's build something.",
    }),
  );
  const json = await response.json();

  expect(response.status).toBe(500);
  expect(JSON.stringify(json)).not.toContain("connection refused");
});
