import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FloatingConcierge } from "./FloatingConcierge";

// Mock next/navigation
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("FloatingConcierge component", () => {
  it("renders the floating concierge trigger button on storefront pages", () => {
    mockPathname = "/";
    render(<FloatingConcierge />);
    const trigger = screen.getByRole("button", { name: /open whatsapp styling concierge/i });
    expect(trigger).toBeInTheDocument();
  });

  it("toggles the concierge drawer open and displays inquiry prompts", () => {
    mockPathname = "/women/sarees";
    render(<FloatingConcierge />);
    const trigger = screen.getByRole("button", { name: /open whatsapp styling concierge/i });
    fireEvent.click(trigger);

    expect(screen.getByText("Atelier Concierge Desk")).toBeInTheDocument();
    expect(screen.getByText("Silk Mark & Saree Inquiries")).toBeInTheDocument();
    expect(screen.getByText("Bespoke Blouse Tailoring")).toBeInTheDocument();
  });

  it("does not render on checkout route to avoid payment flow distraction", () => {
    mockPathname = "/checkout";
    const { container } = render(<FloatingConcierge />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render on admin routes", () => {
    mockPathname = "/admin/orders";
    const { container } = render(<FloatingConcierge />);
    expect(container.firstChild).toBeNull();
  });
});
