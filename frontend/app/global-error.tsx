"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0e14",
          color: "#eaf2f5",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>The application failed to load</h1>
        <p style={{ marginTop: "8px", color: "#8ca0af", maxWidth: "420px" }}>
          A critical error occurred. Please try reloading the page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "24px",
            background: "#4fd8e8",
            color: "#0a0e14",
            fontWeight: 600,
            padding: "12px 24px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
