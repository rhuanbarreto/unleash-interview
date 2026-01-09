import { test, expect, describe } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  test("returns initial value immediately", async () => {
    const { result } = renderHook(() => useDebounce("initial"));
    expect(result.current).toBe("initial");
  });

  test("debounces value changes", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "first" },
    });
    expect(result.current).toBe("first");

    // Update the value
    rerender({ value: "second" });

    // Value should not change immediately
    expect(result.current).toBe("first");

    // Wait for debounce delay (250ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Value should now be updated
    expect(result.current).toBe("second");
  });

  test("cancels previous timeout on rapid changes", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "first" },
    });

    expect(result.current).toBe("first");

    // Rapid changes
    rerender({ value: "second" });
    await new Promise((resolve) => setTimeout(resolve, 100));
    rerender({ value: "third" });
    await new Promise((resolve) => setTimeout(resolve, 100));
    rerender({ value: "fourth" });

    // Wait for debounce delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Only the last value should be set
    expect(result.current).toBe("fourth");
  });

  test("handles empty string", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "text" },
    });

    expect(result.current).toBe("text");

    rerender({ value: "" });

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(result.current).toBe("");
  });

  test("handles multiple sequential updates", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "a" },
    });

    expect(result.current).toBe("a");

    // First update
    rerender({ value: "b" });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(result.current).toBe("b");

    // Second update after first completes
    rerender({ value: "c" });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(result.current).toBe("c");
  });
});
