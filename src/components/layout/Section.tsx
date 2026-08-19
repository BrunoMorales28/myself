import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

type SectionProps = {
  children: React.ReactNode;
  tint?: "default" | "light" | "deep";
  id?: string;
};

export function Section({ children, tint = "default", id }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        bgcolor:
          tint === "default"
            ? "background.default"
            : tint === "light"
              ? "sectionTint.light"
              : "sectionTint.deep",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        {children}
      </Container>
    </Box>
  );
}
