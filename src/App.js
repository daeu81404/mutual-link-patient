import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Consent from "./Consent";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a73e8",
    },
    background: {
      default: "#f7f9fc",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Consent />
    </ThemeProvider>
  );
}

export default App;
