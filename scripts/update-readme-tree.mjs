#!/usr/bin/env node
// Regenerates the "Project structure" tree in README.md from the repo's
// actual tracked + untracked-but-not-ignored files (`git ls-files -co
// --exclude-standard`), so the tree always matches .gitignore automatically
// and never needs a manually-maintained exclude list. Run by the
// post-file-write hook (see .claude/settings.json) and safe to run by hand.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const START = "<!-- PROJECT-TREE:START -->";
const END = "<!-- PROJECT-TREE:END -->";

function getRepoFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { encoding: "utf-8" },
  );
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

function buildTree(paths) {
  const root = new Map();
  for (const path of paths) {
    const parts = path.split("/");
    let node = root;
    for (const part of parts) {
      if (!node.has(part)) node.set(part, new Map());
      node = node.get(part);
    }
  }
  return root;
}

function renderTree(node, prefix = "") {
  const entries = [...node.entries()].sort(([a, aChildren], [b, bChildren]) => {
    const aIsDir = aChildren.size > 0;
    const bIsDir = bChildren.size > 0;
    if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
    return a.localeCompare(b);
  });

  let lines = [];
  entries.forEach(([name, children], index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const isDir = children.size > 0;
    lines.push(`${prefix}${connector}${name}${isDir ? "/" : ""}`);
    if (isDir) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      lines = lines.concat(renderTree(children, childPrefix));
    }
  });
  return lines;
}

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const files = getRepoFiles();
const tree = buildTree(files);
const lines = [`${pkg.name}/`, ...renderTree(tree)];

const readmePath = new URL("../README.md", import.meta.url);
const readme = readFileSync(readmePath, "utf-8");

const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);
if (startIdx === -1 || endIdx === -1) {
  console.error(
    `Could not find ${START} / ${END} markers in README.md — nothing updated.`,
  );
  process.exit(1);
}

const before = readme.slice(0, startIdx + START.length);
const after = readme.slice(endIdx);
const block = `\n\n\`\`\`\n${lines.join("\n")}\n\`\`\`\n\n`;

const updated = before + block + after;
if (updated !== readme) {
  writeFileSync(readmePath, updated);
  console.log("README.md project tree updated.");
} else {
  console.log("README.md project tree already up to date.");
}
