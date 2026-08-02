import { render, screen } from "@testing-library/react";
import { Greeting } from "./Greeting";

test("renders a greeting with the given name", () => {
  render(<Greeting name="Bruno" />);
  expect(screen.getByText("Hello, Bruno!")).toBeInTheDocument();
});
