import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyCard } from "./StudyCard";

function renderCard(expanded: boolean, onToggle = jest.fn()) {
  return {
    onToggle,
    ...render(
      <StudyCard
        id="digital-house"
        institution="Digital House"
        logoUrl="/logos/digital-house.svg"
        logoAlt="Digital House logo"
        degree="Native Android Development"
        dateRange="Mar 2016 – Sep 2016"
        description="Intensive course covering native Android app development."
        expanded={expanded}
        onToggle={onToggle}
      />,
    ),
  };
}

test("collapsed card reports aria-expanded=false", () => {
  renderCard(false);

  expect(screen.getByRole("button", { name: /Digital House/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("expanded card shows the description and reports aria-expanded=true", () => {
  renderCard(true);

  expect(screen.getByRole("button", { name: /Digital House/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getByText(/Intensive course covering/)).toBeInTheDocument();
});

test("clicking the header calls onToggle with the card's id", async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  renderCard(false, onToggle);

  await user.click(screen.getByRole("button", { name: /Digital House/ }));

  expect(onToggle).toHaveBeenCalledWith("digital-house");
});

test("renders initials fallback when the logo has no src", () => {
  render(
    <StudyCard
      id="ort"
      institution="Escuelas Técnicas ORT"
      logoUrl=""
      logoAlt="Escuelas Técnicas ORT logo"
      degree="Technical Baccalaureate"
      dateRange="Mar 2009 – Dec 2013"
      description="Secondary education with a technical orientation."
      expanded={false}
      onToggle={jest.fn()}
    />,
  );

  expect(screen.getByText("ET")).toBeInTheDocument();
});
