// src/pages/owner/OwnerCancellationPolicy.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  Skeleton,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import parkingService from "../../services/parkingService";
import ownerService from "../../services/ownerService";

const OwnerCancellationPolicy = () => {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [policy, setPolicy] = useState({
    freeCancellationBefore: "",
    cancellationFee: "",
    feeType: "percentage",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchParking();
  }, [parkingId]);

  const fetchParking = async () => {
    try {
      setLoading(true);
      const res = await parkingService.getParkingById(parkingId);
      const data = res.data || res;
      setParking(data);
      setPolicy(
        data.cancellationPolicy || {
          freeCancellationBefore: "",
          cancellationFee: "",
          feeType: "percentage",
          description: "",
        },
      );
    } catch (err) {
      setError(err.message || "Failed to load parking");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  const savePolicy = async () => {
    try {
      await ownerService.updateCancellationPolicy(parkingId, policy);
      setSnackbar({
        open: true,
        message: "Cancellation policy saved",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed",
        severity: "error",
      });
    }
  };

  if (loading)
    return (
      <Container>
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Cancellation Policy – {parking?.name}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Free Cancellation Before (hours)"
              name="freeCancellationBefore"
              type="number"
              value={policy.freeCancellationBefore}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cancellation Fee"
              name="cancellationFee"
              type="number"
              value={policy.cancellationFee}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Fee Type</InputLabel>
              <Select
                name="feeType"
                value={policy.feeType}
                onChange={handleChange}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (optional)"
              name="description"
              multiline
              rows={3}
              value={policy.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={savePolicy}
            >
              Save Policy
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerCancellationPolicy;
