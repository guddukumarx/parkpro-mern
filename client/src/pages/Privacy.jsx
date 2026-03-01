import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const Privacy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>
        <Typography paragraph>
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </Typography>
        {/* Add full privacy policy content here */}
      </Paper>
    </Container>
  );
};

export default Privacy;
