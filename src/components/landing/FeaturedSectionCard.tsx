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
    <Card sx={{ flex: "1 1 280px" }}>
      <CardActionArea
        component={Link}
        href={href}
        sx={{ p: 2, height: "100%" }}
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
