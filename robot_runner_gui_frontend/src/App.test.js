import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard header", () => {
  render(<App />);
  const heading = screen.getByText(/dashboard/i);
  expect(heading).toBeInTheDocument();
});
