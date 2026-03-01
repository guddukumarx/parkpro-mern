import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Support = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Support Center
      </Typography>
      <Typography>
        For assistance, please visit our <a href="/contact">Contact page</a> or
        email support@parkpro.com.
      </Typography>
    </Container>
  );
};

export default Support;
