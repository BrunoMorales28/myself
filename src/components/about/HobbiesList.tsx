"use client";

import { useEffect, useRef, useState } from "react";
import type SvgIcon from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import { HobbyCard } from "./HobbyCard";

export type HobbiesListEntry = {
  id: string;
  label: string;
  description: string;
  icon: typeof SvgIcon;
};

type HobbiesListProps = {
  entries: HobbiesListEntry[];
  highlight?: string;
};

export function HobbiesList({ entries, highlight }: HobbiesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    highlight && entries.some((entry) => entry.id === highlight)
      ? highlight
      : null,
  );
  const highlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlight) {
      highlightedRef.current?.scrollIntoView?.({ block: "center" });
    }
    // Only run on mount for the initial highlight — later expand/collapse
    // interactions shouldn't re-trigger a scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {entries.map((entry) => (
        <HobbyCard
          key={entry.id}
          ref={entry.id === highlight ? highlightedRef : undefined}
          id={entry.id}
          label={entry.label}
          description={entry.description}
          icon={entry.icon}
          expanded={expandedId === entry.id}
          onToggle={(id) =>
            setExpandedId((current) => (current === id ? null : id))
          }
        />
      ))}
    </Box>
  );
}
