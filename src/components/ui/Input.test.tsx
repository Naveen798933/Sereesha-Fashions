import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input component", () => {
  it("renders with label and helper text", () => {
    render(
      <Input label="Postal PIN Code" helperText="Enter 6-digit Indian PIN" placeholder="500034" />
    );
    expect(screen.getByLabelText(/postal pin code/i)).toBeInTheDocument();
    expect(screen.getByText(/enter 6-digit indian pin/i)).toBeInTheDocument();
  });

  it("renders error state with accessible error message", () => {
    render(<Input label="PIN Code" error="Invalid PIN code entered" placeholder="500034" />);
    const input = screen.getByLabelText(/pin code/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/invalid pin code entered/i)).toBeInTheDocument();
  });

  it("handles user typing correctly", () => {
    render(<Input label="Name" placeholder="Enter name" />);
    const input = screen.getByPlaceholderText(/enter name/i);
    fireEvent.change(input, { target: { value: "Sreya" } });
    expect(input).toHaveValue("Sreya");
  });
});
