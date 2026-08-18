import { render, screen } from "@testing-library/react";
import { SkillCategorySection } from "./SkillCategorySection";

test("renders category heading and items as a labeled group of chips", () => {
  render(
    <SkillCategorySection
      category="Frontend Core"
      items={["React.js", "TypeScript", "Redux"]}
      itemsGroupLabel="Frontend Core skills"
    />,
  );

  expect(
    screen.getByRole("heading", { level: 3, name: "Frontend Core" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: "Frontend Core skills" }),
  ).toBeInTheDocument();
  expect(screen.getByText("React.js")).toBeInTheDocument();
  expect(screen.getByText("TypeScript")).toBeInTheDocument();
  expect(screen.getByText("Redux")).toBeInTheDocument();
});
