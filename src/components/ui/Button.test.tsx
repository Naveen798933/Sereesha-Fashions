import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders with default primary styling and text", () => {
    render(<Button>Add to Bag</Button>);
    const button = screen.getByRole("button", { name: /add to bag/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[#1C1B19]");
  });

  it("handles click events properly", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders loading state with spinner and disables button", () => {
    render(<Button loading>Processing</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Processing");
  });

  it("disables button when disabled prop is provided", () => {
    render(<Button disabled>Sold Out</Button>);
    const button = screen.getByRole("button", { name: /sold out/i });
    expect(button).toBeDisabled();
  });
});
