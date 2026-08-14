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
    <Box component="section" sx={{ py: 2 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {items.map((item) => (
          <Card key={item.id} sx={{ flex: "1 1 240px" }}>
            <CardActionArea component={Link} href={item.href} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                {item.avatar}
                <Typography variant="subtitle1">{item.title}</Typography>
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
