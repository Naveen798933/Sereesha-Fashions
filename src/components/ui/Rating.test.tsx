import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Rating } from "./Rating";

describe("Rating component", () => {
  it("renders non-interactive rating with aria label and count", () => {
    render(<Rating value={4.5} count={28} />);

    expect(screen.getByRole("img", { name: /rating: 4.5 out of 5 stars/i })).toBeInTheDocument();
    expect(screen.getByText("(28)")).toBeInTheDocument();
  });

  it("handles interactive rating star clicks", () => {
    const handleChange = vi.fn();
    render(<Rating value={3} interactive onChange={handleChange} />);

    const fourStarBtn = screen.getByRole("button", { name: /rate 4 stars/i });
    fireEvent.click(fourStarBtn);

    expect(handleChange).toHaveBeenCalledWith(4);
  });
});
