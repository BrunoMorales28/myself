import { forwardRef } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getInitials } from "@/lib/initials";

export type StudyCardProps = {
  id: string;
  institution: string;
  logoUrl: string;
  logoAlt: string;
  degree: string;
  dateRange: string;
  description: string;
  expanded: boolean;
  onToggle: (id: string) => void;
};

export const StudyCard = forwardRef<HTMLDivElement, StudyCardProps>(
  function StudyCard(
    {
      id,
      institution,
      logoUrl,
      logoAlt,
      degree,
      dateRange,
      description,
      expanded,
      onToggle,
    },
    ref,
  ) {
    const detailsId = `study-details-${id}`;

    return (
      <Card ref={ref} sx={{ mb: 2 }}>
        <ButtonBase
          onClick={() => onToggle(id)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          sx={{
            width: "100%",
            p: 2,
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
              {getInitials(institution)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">{degree}</Typography>
              <Typography variant="body2" color="text.secondary">
                {institution} · {dateRange}
              </Typography>
            </Box>
          </Stack>
        </ButtonBase>
        <Collapse in={expanded}>
          <Box id={detailsId} sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2">{description}</Typography>
          </Box>
        </Collapse>
      </Card>
    );
  },
);
