// src/pages/owner/OwnerOperatingHours.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  Snackbar,
  Skeleton,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import parkingService from "../../services/parkingService";
import ownerService from "../../services/ownerService";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const OwnerOperatingHours = () => {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [hours, setHours] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", reason: "" });
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
      setHours(data.operatingHours || {});
      setHolidays(data.holidays || []);
    } catch (err) {
      setError(err.message || "Failed to load parking");
    } finally {
      setLoading(false);
    }
  };

  const handleHourChange = (day, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleClosedToggle = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day]?.closed },
    }));
  };

  const saveHours = async () => {
    try {
      await ownerService.updateOperatingHours(parkingId, hours);
      setSnackbar({
        open: true,
        message: "Operating hours saved",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to save",
        severity: "error",
      });
    }
  };

  const addHoliday = async () => {
    if (!newHoliday.date) return;
    try {
      await ownerService.addHoliday(
        parkingId,
        newHoliday.date,
        newHoliday.reason,
      );
      setSnackbar({
        open: true,
        message: "Holiday added",
        severity: "success",
      });
      setNewHoliday({ date: "", reason: "" });
      fetchParking();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed",
        severity: "error",
      });
    }
  };

  const removeHoliday = async (holidayId) => {
    try {
      await ownerService.removeHoliday(parkingId, holidayId);
      setSnackbar({
        open: true,
        message: "Holiday removed",
        severity: "success",
      });
      fetchParking();
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
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Operating Hours – {parking?.name}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Daily Hours
        </Typography>
        <Grid container spacing={2}>
          {days.map((day) => (
            <Grid item xs={12} key={day}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ width: 100, textTransform: "capitalize" }}>
                  {day}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!hours[day]?.closed}
                      onChange={() => handleClosedToggle(day)}
                    />
                  }
                  label="Open"
                />
                {!hours[day]?.closed && (
                  <>
                    <TextField
                      label="Open"
                      type="time"
                      value={hours[day]?.open || "09:00"}
                      onChange={(e) =>
                        handleHourChange(day, "open", e.target.value)
                      }
                      size="small"
                      sx={{ width: 120 }}
                    />
                    <TextField
                      label="Close"
                      type="time"
                      value={hours[day]?.close || "17:00"}
                      onChange={(e) =>
                        handleHourChange(day, "close", e.target.value)
                      }
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveHours}
          >
            Save Hours
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Holidays
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, date: e.target.value })
            }
          />
          <TextField
            label="Reason"
            value={newHoliday.reason}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, reason: e.target.value })
            }
          />
          <Button variant="contained" onClick={addHoliday}>
            Add Holiday
          </Button>
        </Box>

        {holidays.length === 0 ? (
          <Typography>No holidays set</Typography>
        ) : (
          holidays.map((h) => (
            <Box
              key={h._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
              }}
            >
              <Typography>
                {new Date(h.date).toLocaleDateString()} – {h.reason}
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={() => removeHoliday(h._id)}
              >
                Remove
              </Button>
            </Box>
          ))
        )}
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

export default OwnerOperatingHours;
