import { render, screen } from "@testing-library/react";
import Avatar from "@mui/material/Avatar";
import { ItemListSection, type ItemListEntry } from "./ItemListSection";

// Isolates this test from next-intl's locale-prefixing logic (covered by
// e2e), and sidesteps a Jest/ESM resolution mismatch in next-intl's package.
jest.mock("../../i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderList(items: ItemListEntry[]) {
  return render(
    <ItemListSection
      title="Experience"
      items={items}
      viewAllHref="/experience"
      viewAllLabel="View all experience"
    />,
  );
}

test("renders one link per item with the correct highlight href", () => {
  renderList([
    {
      id: "globant-sportian",
      title: "React.js Developer",
      href: "/experience?highlight=globant-sportian",
      avatar: <Avatar>G</Avatar>,
    },
    {
      id: "hootsuite",
      title: "React.js Developer",
      href: "/experience?highlight=hootsuite",
      avatar: <Avatar>H</Avatar>,
    },
  ]);

  const links = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("href")?.includes("highlight"));
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute(
    "href",
    "/experience?highlight=globant-sportian",
  );
});

test("renders the view-all link when provided", () => {
  renderList([
    {
      id: "globant-sportian",
      title: "React.js Developer",
      href: "/experience?highlight=globant-sportian",
      avatar: <Avatar>G</Avatar>,
    },
  ]);

  expect(
    screen.getByRole("link", { name: "View all experience" }),
  ).toHaveAttribute("href", "/experience");
});

test("renders the given avatar node next to each item's title", () => {
  // No `src` on the Avatar mirrors today's real content data (logo assets
  // aren't sourced yet), which is exactly when MUI's Avatar renders its
  // `children` fallback — the initials — instead of an <img>.
  renderList([
    {
      id: "globant-sportian",
      title: "React.js Developer",
      href: "/experience?highlight=globant-sportian",
      avatar: <Avatar aria-label="Globant logo">G</Avatar>,
    },
  ]);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("G")).toBeInTheDocument();
});
