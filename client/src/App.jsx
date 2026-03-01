// src/App.jsx (updated)
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {/* AuthProvider removed from here */}
        <BrowserRouter>
          <ScrollToTop />
          <CssBaseline />
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
