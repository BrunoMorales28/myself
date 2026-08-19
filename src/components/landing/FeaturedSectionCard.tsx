import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import { Link } from "@/i18n/navigation";

type FeaturedSectionCardProps = {
  title: string;
  description: string;
  href: string;
};

export function FeaturedSectionCard({
  title,
  description,
  href,
}: FeaturedSectionCardProps) {
  return (
    <Card sx={{ flex: "1 1 280px", borderRadius: "16px" }}>
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: "100%",
          py: { xs: 3.25, sm: 4.25 },
          px: { xs: 2.5, sm: 3.25 },
        }}
      >
        <Typography
          variant="subtitle1"
          component="span"
          sx={{ mb: 1, display: "block" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
