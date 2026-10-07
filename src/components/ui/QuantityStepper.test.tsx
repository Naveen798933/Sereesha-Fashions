import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuantityStepper } from "./QuantityStepper";

describe("QuantityStepper component", () => {
  it("renders current value and buttons", () => {
    render(<QuantityStepper value={2} onChange={vi.fn()} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase quantity/i })).toBeInTheDocument();
  });

  it("calls onChange with incremented and decremented values", () => {
    const handleChange = vi.fn();
    render(<QuantityStepper value={2} min={1} max={5} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    expect(handleChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("disables decrease button when value equals min", () => {
    render(<QuantityStepper value={1} min={1} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
  });
});
