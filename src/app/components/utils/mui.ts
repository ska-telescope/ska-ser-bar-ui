"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#070068",
      light: "#514d95",
      dark: "#050049",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E50869",
      light: "#ed5296",
      dark: "#a0064a",
      contrastText: "#FFFFFF",
    },
  },
});

export default theme;
