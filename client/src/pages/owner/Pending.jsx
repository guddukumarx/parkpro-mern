// src/pages/owner/Pending.jsx
import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const Pending = () => {
  const { user } = useAuth();
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Account Pending Approval
        </Typography>
        <Typography variant="body1" paragraph>
          Hi {user?.name}, your owner account is pending admin approval. You'll
          be able to add parkings once approved.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This usually takes 1-2 business days. We'll notify you by email.
        </Typography>
      </Paper>
    </Container>
  );
};
export default Pending;
