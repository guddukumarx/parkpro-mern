import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import ownerService from "../../services/ownerService";
import parkingService from "../../services/parkingService";

const OwnerPeakPricing = () => {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    enabled: true,
    daysOfWeek: [],
    timeRange: { start: "", end: "" },
    dateRange: { start: "", end: "" },
    adjustmentType: "percentage",
    adjustmentValue: "",
    priority: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, rule: null });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const weekDays = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  useEffect(() => {
    fetchData();
  }, [parkingId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [parkingRes, rulesRes] = await Promise.all([
        parkingService.getParkingById(parkingId),
        ownerService.getPricingRules(parkingId),
      ]);
      setParking(parkingRes.data || parkingRes);
      setRules(rulesRes.data || rulesRes);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({
      name: "",
      enabled: true,
      daysOfWeek: [],
      timeRange: { start: "", end: "" },
      dateRange: { start: "", end: "" },
      adjustmentType: "percentage",
      adjustmentValue: "",
      priority: 0,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setEditMode(true);
    setCurrentRule(rule);
    setFormData({
      name: rule.name,
      enabled: rule.enabled,
      daysOfWeek: rule.daysOfWeek || [],
      timeRange: rule.timeRange || { start: "", end: "" },
      dateRange: rule.dateRange
        ? {
            start: rule.dateRange.start
              ? rule.dateRange.start.split("T")[0]
              : "",
            end: rule.dateRange.end ? rule.dateRange.end.split("T")[0] : "",
          }
        : { start: "", end: "" },
      adjustmentType: rule.adjustmentType,
      adjustmentValue: rule.adjustmentValue,
      priority: rule.priority,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleTimeChange = (field, value) => {
    setFormData({
      ...formData,
      timeRange: { ...formData.timeRange, [field]: value },
    });
  };

  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      dateRange: { ...formData.dateRange, [field]: value },
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.adjustmentValue)
      errors.adjustmentValue = "Adjustment value is required";
    else if (isNaN(formData.adjustmentValue))
      errors.adjustmentValue = "Must be a number";
    if (
      formData.adjustmentType === "percentage" &&
      (formData.adjustmentValue < -100 || formData.adjustmentValue > 1000)
    ) {
      errors.adjustmentValue = "Percentage must be between -100 and 1000";
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        ...formData,
        adjustmentValue: parseFloat(formData.adjustmentValue),
        priority: parseInt(formData.priority) || 0,
      };
      // Clean empty objects
      if (!payload.timeRange.start || !payload.timeRange.end)
        delete payload.timeRange;
      if (!payload.dateRange.start || !payload.dateRange.end)
        delete payload.dateRange;
      if (editMode) {
        await ownerService.updatePricingRule(
          parkingId,
          currentRule._id,
          payload,
        );
        setSnackbar({
          open: true,
          message: "Rule updated",
          severity: "success",
        });
      } else {
        await ownerService.createPricingRule(parkingId, payload);
        setSnackbar({
          open: true,
          message: "Rule created",
          severity: "success",
        });
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await ownerService.deletePricingRule(parkingId, deleteDialog.rule._id);
      setSnackbar({ open: true, message: "Rule deleted", severity: "success" });
      setDeleteDialog({ open: false, rule: null });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Peak Pricing – {parking?.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Rule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {rules.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No pricing rules defined.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rules.map((rule) => (
            <Grid item xs={12} md={6} key={rule._id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{rule.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(rule)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, rule })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">
                  Adjustment:{" "}
                  {rule.adjustmentType === "percentage"
                    ? `${rule.adjustmentValue}%`
                    : `$${rule.adjustmentValue}`}
                </Typography>
                {rule.daysOfWeek?.length > 0 && (
                  <Typography variant="body2">
                    Days:{" "}
                    {rule.daysOfWeek
                      .map((d) => weekDays.find((w) => w.value === d)?.label)
                      .join(", ")}
                  </Typography>
                )}
                {rule.timeRange?.start && rule.timeRange?.end && (
                  <Typography variant="body2">
                    Time: {rule.timeRange.start} - {rule.timeRange.end}
                  </Typography>
                )}
                {rule.dateRange?.start && rule.dateRange?.end && (
                  <Typography variant="body2">
                    Dates: {new Date(rule.dateRange.start).toLocaleDateString()}{" "}
                    - {new Date(rule.dateRange.end).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="body2">
                  Priority: {rule.priority}
                </Typography>
                <Typography variant="body2">
                  Status: {rule.enabled ? "Active" : "Inactive"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Rule" : "Add Peak Pricing Rule"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Adjustment Type</InputLabel>
                <Select
                  name="adjustmentType"
                  value={formData.adjustmentType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={
                  formData.adjustmentType === "percentage"
                    ? "Percentage (e.g., 20 for +20%, -10 for -10%)"
                    : "Amount ($)"
                }
                name="adjustmentValue"
                type="number"
                value={formData.adjustmentValue}
                onChange={handleInputChange}
                error={!!formErrors.adjustmentValue}
                helperText={formErrors.adjustmentValue}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Days of Week (leave empty for all)</InputLabel>
                <Select
                  multiple
                  name="daysOfWeek"
                  value={formData.daysOfWeek}
                  onChange={handleInputChange}
                  renderValue={(selected) =>
                    selected
                      .map((v) => weekDays.find((d) => d.value === v)?.label)
                      .join(", ")
                  }
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time From (optional)"
                type="time"
                value={formData.timeRange.start}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time To (optional)"
                type="time"
                value={formData.timeRange.end}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date (optional)"
                type="date"
                value={formData.dateRange.start}
                onChange={(e) => handleDateChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date (optional)"
                type="date"
                value={formData.dateRange.end}
                onChange={(e) => handleDateChange("end", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority (higher number overrides)"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData({ ...formData, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, rule: null })}
      >
        <DialogTitle>Delete Rule</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteDialog.rule?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, rule: null })}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default OwnerPeakPricing;
