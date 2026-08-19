import { createTheme, alpha } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sectionTint: { light: string; deep: string };
  }
  interface PaletteOptions {
    sectionTint?: { light: string; deep: string };
  }
}

// Mockup used #1F8A5F, but that hex clears only ~4.33:1 against white in
// either text-on-green or green-on-white direction — just under the 4.5:1 AA
// floor for normal text. Darkened slightly (~5.2:1 both directions) to stay
// visually equivalent while passing the contrast check called out in spec 17.
const primaryMain = "#1B7C55";

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      dark: "#145F42",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5C6B62",
      dark: "#3F4A44",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FAFDFB",
    },
    text: {
      primary: "#171C19",
      secondary: "#4E5A51",
    },
    divider: "#E1EFE6",
    sectionTint: {
      light: alpha(primaryMain, 0.06),
      deep: alpha(primaryMain, 0.12),
    },
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    // MUI's default h1-h5 sizes (up to 96px for h1) come from a scale meant
    // for a much heavier editorial layout than this site's; explicit clamp()
    // sizes keep headings readable at both mobile and desktop widths without
    // needing separate breakpoint overrides everywhere they're used. h1 here
    // only affects page headings (Studies, Experience, ...) since Hero sets
    // its own larger size inline.
    h1: {
      fontFamily: "var(--font-heading), sans-serif",
      fontWeight: 700,
      fontSize: "clamp(2.25rem, 1.4rem + 3vw, 3rem)",
    },
    h2: {
      fontFamily: "var(--font-heading), sans-serif",
      fontWeight: 700,
      fontSize: "clamp(1.75rem, 1.3rem + 1.8vw, 2.25rem)",
    },
    h3: {
      fontFamily: "var(--font-heading), sans-serif",
      fontWeight: 700,
      fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 1.875rem)",
    },
    h4: {
      fontFamily: "var(--font-heading), sans-serif",
      fontWeight: 700,
      fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)",
    },
    h5: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 700 },
    h6: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 700 },
    button: { fontFamily: "var(--font-body), sans-serif", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid",
          borderColor: "#E1EFE6",
          boxShadow: "0 1px 2px rgba(23,24,28,0.03)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
  },
});
