import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb component", () => {
  it("renders Home and passed breadcrumb items", () => {
    const items = [
      { label: "Women", href: "/women" },
      { label: "Sarees", href: "/women/sarees" },
      { label: "Kanchipuram Pure Silk" },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByRole("link", { name: /^home$/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^women$/i })).toHaveAttribute("href", "/women");
    expect(screen.getByRole("link", { name: /^sarees$/i })).toHaveAttribute(
      "href",
      "/women/sarees"
    );

    const currentItem = screen.getByText("Kanchipuram Pure Silk");
    expect(currentItem).toBeInTheDocument();
    expect(currentItem).toHaveAttribute("aria-current", "page");
  });

  it("renders with custom className without breaking", () => {
    const items = [{ label: "Collections" }];
    const { container } = render(<Breadcrumb items={items} className="custom-test-class" />);
    expect(container.querySelector("nav")).toHaveClass("custom-test-class");
  });
});
