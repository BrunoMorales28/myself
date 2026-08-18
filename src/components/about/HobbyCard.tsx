import { forwardRef } from "react";
import type SvgIcon from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type HobbyCardProps = {
  id: string;
  label: string;
  description: string;
  icon: typeof SvgIcon;
  expanded: boolean;
  onToggle: (id: string) => void;
};

export const HobbyCard = forwardRef<HTMLDivElement, HobbyCardProps>(
  function HobbyCard(
    { id, label, description, icon: Icon, expanded, onToggle },
    ref,
  ) {
    const detailsId = `hobby-details-${id}`;

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
            <Icon color="primary" aria-hidden="true" />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ display: "block", flex: 1 }}
            >
              {label}
            </Typography>
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
