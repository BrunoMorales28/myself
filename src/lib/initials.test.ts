import { getInitials } from "./initials";

test.each([
  ["Globant (client: Sportian)", "G"],
  ["Digital House", "DH"],
  ["Escuelas Técnicas ORT", "ET"],
  ["Mercado Libre", "ML"],
  ["IguanaFix", "I"],
])("getInitials(%s) -> %s", (name, expected) => {
  expect(getInitials(name)).toBe(expected);
});
