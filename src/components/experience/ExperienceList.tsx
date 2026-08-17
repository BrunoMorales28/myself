"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ExperienceCard } from "./ExperienceCard";

export type ExperienceListEntry = {
  id: string;
  company: string;
  logoUrl: string;
  logoAlt: string;
  role: string;
  dateRange: string;
  description: string;
  bullets: string[];
  tags: string[];
};

type ExperienceListProps = {
  professionalEntries: ExperienceListEntry[];
  earlyEntries: ExperienceListEntry[];
  professionalHeading: string;
  earlyHeading: string;
  tagsGroupLabel: string;
  highlight?: string;
};

export function ExperienceList({
  professionalEntries,
  earlyEntries,
  professionalHeading,
  earlyHeading,
  tagsGroupLabel,
  highlight,
}: ExperienceListProps) {
  const allEntries = [...professionalEntries, ...earlyEntries];
  const [expandedId, setExpandedId] = useState<string | null>(
    highlight && allEntries.some((entry) => entry.id === highlight)
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

  const toggle = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 2 }}>
        {professionalHeading}
      </Typography>
      <Box sx={{ mb: 4 }}>
        {professionalEntries.map((entry) => (
          <ExperienceCard
            key={entry.id}
            ref={entry.id === highlight ? highlightedRef : undefined}
            id={entry.id}
            company={entry.company}
            logoUrl={entry.logoUrl}
            logoAlt={entry.logoAlt}
            role={entry.role}
            dateRange={entry.dateRange}
            description={entry.description}
            bullets={entry.bullets}
            tags={entry.tags}
            tagsGroupLabel={tagsGroupLabel}
            expanded={expandedId === entry.id}
            onToggle={toggle}
          />
        ))}
      </Box>

      <Typography
        variant="h2"
        color="text.secondary"
        sx={{ mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        {earlyHeading}
      </Typography>
      <Box>
        {earlyEntries.map((entry) => (
          <ExperienceCard
            key={entry.id}
            ref={entry.id === highlight ? highlightedRef : undefined}
            id={entry.id}
            company={entry.company}
            logoUrl={entry.logoUrl}
            logoAlt={entry.logoAlt}
            role={entry.role}
            dateRange={entry.dateRange}
            description={entry.description}
            bullets={entry.bullets}
            tags={entry.tags}
            tagsGroupLabel={tagsGroupLabel}
            expanded={expandedId === entry.id}
            onToggle={toggle}
          />
        ))}
      </Box>
    </Box>
  );
}
