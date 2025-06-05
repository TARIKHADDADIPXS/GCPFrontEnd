import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#08a955", // Your primary color
      contrastText: "#fff"
    },
    secondary: {
      main: "#9c27b0"
    },
    success: {
      main: "#2e7d32"
    },
    warning: {
      main: "#ed6c02"
    },
    error: {
      main: "#d32f2f"
    },
    info: {
      main: "#0288d1"
    },
    background: {
      default: "#f9f9fb"
    }
  },
  typography: {
    fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

export default theme;