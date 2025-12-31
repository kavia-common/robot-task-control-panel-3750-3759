import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard shell header", () => {
  render(<App />);
  expect(screen.getByText(/Test Automation Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Mock mode/i)).toBeInTheDocument();
});
