"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "3rem 1.5rem",
          maxWidth: "32rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>Something went wrong</h1>
        <p>The app hit an unexpected error. Please try again.</p>
        <button
          onClick={reset}
          style={{
            fontFamily: "inherit",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
