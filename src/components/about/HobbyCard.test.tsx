import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { HobbyCard } from "./HobbyCard";

function renderCard(expanded: boolean, onToggle = jest.fn()) {
  return {
    onToggle,
    ...render(
      <HobbyCard
        id="reading"
        label="Reading"
        description="Mostly fantasy and sci-fi."
        icon={MenuBookIcon}
        expanded={expanded}
        onToggle={onToggle}
      />,
    ),
  };
}

test("collapsed card reports aria-expanded=false", () => {
  renderCard(false);

  expect(screen.getByRole("button", { name: /Reading/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("expanded card shows the description and reports aria-expanded=true", () => {
  renderCard(true);

  expect(screen.getByRole("button", { name: /Reading/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getByText(/Mostly fantasy and sci-fi/)).toBeInTheDocument();
});

test("clicking the header calls onToggle with the card's id", async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  renderCard(false, onToggle);

  await user.click(screen.getByRole("button", { name: /Reading/ }));

  expect(onToggle).toHaveBeenCalledWith("reading");
});
