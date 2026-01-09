import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  afterEach(cleanup);

  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Test content")).toBeDefined();
  });

  test("renders error UI when an error is thrown", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeDefined();

    // Restore console.error
    console.error = originalError;
  });

  test("renders refresh button when error occurs", () => {
    const originalError = console.error;
    console.error = () => {};

    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const refreshButton = container.querySelector(".error-button");
    expect(refreshButton).toBeDefined();
    expect(refreshButton?.textContent).toBe("Refresh Page");

    console.error = originalError;
  });
});
