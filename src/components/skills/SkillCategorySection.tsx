import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type SkillCategorySectionProps = {
  category: string;
  items: string[];
  itemsGroupLabel: string;
};

export function SkillCategorySection({
  category,
  items,
  itemsGroupLabel,
}: SkillCategorySectionProps) {
  return (
    <Box component="section" sx={{ flex: "1 1 260px" }}>
      <Typography variant="h3" sx={{ mb: 1.5 }}>
        {category}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        role="group"
        aria-label={itemsGroupLabel}
        sx={{ flexWrap: "wrap", gap: 1 }}
      >
        {items.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </Stack>
    </Box>
  );
}
