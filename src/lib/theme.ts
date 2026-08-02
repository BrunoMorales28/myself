import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0B3D66",
      light: "#3D6A94",
      dark: "#062944",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5A6B7B",
      light: "#8593A0",
      dark: "#3D4A56",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1F24",
      secondary: "#5A6472",
    },
  },
  typography: {
    fontFamily: "var(--font-sans), sans-serif",
  },
  shape: {
    borderRadius: 4,
  },
});
