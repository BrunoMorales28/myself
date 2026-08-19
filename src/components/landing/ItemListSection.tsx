import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "@/i18n/navigation";

export type ItemListEntry = {
  id: string;
  title: string;
  avatar: ReactNode;
  href: string;
};

type ItemListSectionProps = {
  title: string;
  items: ItemListEntry[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function ItemListSection({
  title,
  items,
  viewAllHref,
  viewAllLabel,
}: ItemListSectionProps) {
  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {items.map((item) => (
          <Card key={item.id} sx={{ flex: "1 1 240px" }}>
            <CardActionArea
              component={Link}
              href={item.href}
              sx={{
                height: "100%",
                py: { xs: 2.75, sm: 3.75 },
                px: { xs: 2.25, sm: 2.5 },
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                {item.avatar}
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ display: "block" }}
                >
                  {item.title}
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {viewAllHref && viewAllLabel && (
        <Box sx={{ mt: 2 }}>
          <Typography component={Link} href={viewAllHref} variant="body2">
            {viewAllLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
