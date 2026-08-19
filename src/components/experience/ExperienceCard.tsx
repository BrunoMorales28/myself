import { forwardRef } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getInitials } from "@/lib/initials";

export type ExperienceCardProps = {
  id: string;
  company: string;
  logoUrl: string;
  logoAlt: string;
  role: string;
  dateRange: string;
  description: string;
  bullets: string[];
  tags: string[];
  tagsGroupLabel: string;
  expanded: boolean;
  onToggle: (id: string) => void;
};

export const ExperienceCard = forwardRef<HTMLDivElement, ExperienceCardProps>(
  function ExperienceCard(
    {
      id,
      company,
      logoUrl,
      logoAlt,
      role,
      dateRange,
      description,
      bullets,
      tags,
      tagsGroupLabel,
      expanded,
      onToggle,
    },
    ref,
  ) {
    const detailsId = `experience-details-${id}`;

    return (
      <Card ref={ref} sx={{ mb: 2 }}>
        <ButtonBase
          onClick={() => onToggle(id)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          sx={{
            width: "100%",
            py: { xs: 2.75, sm: 3.75 },
            px: { xs: 2.25, sm: 2.5 },
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", width: "100%" }}
          >
            <Avatar src={logoUrl} alt={logoAlt}>
              {getInitials(company)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{ display: "block" }}
              >
                {company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role} · {dateRange}
              </Typography>
            </Box>
          </Stack>
        </ButtonBase>
        <Collapse in={expanded}>
          <Box id={detailsId} sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2">{description}</Typography>
            {bullets.length > 0 && (
              <Box component="ul" sx={{ pl: 3, my: 1.5, "& li": { mb: 0.5 } }}>
                {bullets.map((bullet, index) => (
                  <Typography key={index} component="li" variant="body2">
                    {bullet}
                  </Typography>
                ))}
              </Box>
            )}
            {tags.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                role="group"
                aria-label={tagsGroupLabel}
                sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}
              >
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Stack>
            )}
          </Box>
        </Collapse>
      </Card>
    );
  },
);
