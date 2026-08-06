import { experience, studies, skills, about, getLocalizedText } from "./index";
import type { LocalizedText } from "./types";

function expectLocalized(value: LocalizedText, label: string) {
  if (value.en.trim() === "") {
    throw new Error(`${label}.en is empty`);
  }
  if (value.es.trim() === "") {
    throw new Error(`${label}.es is empty`);
  }
}

describe("experience", () => {
  it("has at least one entry", () => {
    expect(experience.length).toBeGreaterThan(0);
  });

  it.each(experience)("$company has fully localized text", (entry) => {
    expectLocalized(entry.role, `${entry.company}.role`);
    expectLocalized(entry.description, `${entry.company}.description`);
    entry.bullets.forEach((bullet, i) =>
      expectLocalized(bullet, `${entry.company}.bullets[${i}]`),
    );
  });
});

describe("studies", () => {
  it("has at least one entry", () => {
    expect(studies.length).toBeGreaterThan(0);
  });

  it.each(studies)("$institution has fully localized text", (entry) => {
    expectLocalized(entry.degree, `${entry.institution}.degree`);
    if (entry.description) {
      expectLocalized(entry.description, `${entry.institution}.description`);
    }
  });
});

describe("skills", () => {
  it("has at least one category", () => {
    expect(skills.length).toBeGreaterThan(0);
  });

  it.each(skills)("$category.en has items and localized label", (group) => {
    expectLocalized(group.category, `${group.category.en}.category`);
    expect(group.items.length).toBeGreaterThan(0);
  });
});

describe("about", () => {
  it("has fully localized bio and hobbies", () => {
    expectLocalized(about.bio, "about.bio");
    about.hobbies.forEach((hobby, i) =>
      expectLocalized(hobby, `about.hobbies[${i}]`),
    );
  });
});

describe("getLocalizedText", () => {
  it("resolves both locales for a sample entry", () => {
    const [first] = experience;
    expect(getLocalizedText(first.role, "en")).toBe(first.role.en);
    expect(getLocalizedText(first.role, "es")).toBe(first.role.es);
  });
});
