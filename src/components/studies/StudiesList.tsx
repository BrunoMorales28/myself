"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { StudyCard } from "./StudyCard";

export type StudiesListEntry = {
  id: string;
  institution: string;
  logoUrl: string;
  logoAlt: string;
  degree: string;
  dateRange: string;
  description: string;
};

type StudiesListProps = {
  entries: StudiesListEntry[];
  highlight?: string;
};

export function StudiesList({ entries, highlight }: StudiesListProps) {
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
        <StudyCard
          key={entry.id}
          ref={entry.id === highlight ? highlightedRef : undefined}
          id={entry.id}
          institution={entry.institution}
          logoUrl={entry.logoUrl}
          logoAlt={entry.logoAlt}
          degree={entry.degree}
          dateRange={entry.dateRange}
          description={entry.description}
          expanded={expandedId === entry.id}
          onToggle={(id) =>
            setExpandedId((current) => (current === id ? null : id))
          }
        />
      ))}
    </Box>
  );
}
