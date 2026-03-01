// src/pages/owner/OwnerCoupons.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";

const OwnerCoupons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state for add/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minBookingAmount: "",
    maxDiscount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    usageLimit: "",
    applicableParkings: [],
    description: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    coupon: null,
  });

  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couponsRes, parkingsRes] = await Promise.all([
        ownerService.getCoupons(),
        ownerService.getParkings(),
      ]);
      setCoupons(couponsRes.data || couponsRes);
      setParkings(parkingsRes.data || parkingsRes);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentCoupon(null);
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minBookingAmount: "",
      maxDiscount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      usageLimit: "",
      applicableParkings: [],
      description: "",
      status: "active",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditMode(true);
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minBookingAmount: coupon.minBookingAmount || "",
      maxDiscount: coupon.maxDiscount || "",
      startDate: coupon.startDate.split("T")[0],
      endDate: coupon.endDate.split("T")[0],
      usageLimit: coupon.usageLimit || "",
      applicableParkings: coupon.applicableParkings || [],
      description: coupon.description || "",
      status: coupon.status,
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

  const handleParkingsChange = (e) => {
    setFormData({ ...formData, applicableParkings: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.value) errors.value = "Value is required";
    else if (isNaN(formData.value) || Number(formData.value) <= 0)
      errors.value = "Value must be positive";
    if (formData.type === "percentage" && Number(formData.value) > 100)
      errors.value = "Percentage cannot exceed 100";
    if (!formData.startDate) errors.startDate = "Start date required";
    if (!formData.endDate) errors.endDate = "End date required";
    else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
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
      if (editMode) {
        await ownerService.updateCoupon(currentCoupon._id, formData);
        setSnackbar({
          open: true,
          message: "Coupon updated",
          severity: "success",
        });
      } else {
        await ownerService.createCoupon(formData);
        setSnackbar({
          open: true,
          message: "Coupon created",
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
      await ownerService.deleteCoupon(deleteDialog.coupon._id);
      setSnackbar({
        open: true,
        message: "Coupon deleted",
        severity: "success",
      });
      setDeleteDialog({ open: false, coupon: null });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
        severity: "error",
      });
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbar({
      open: true,
      message: "Coupon code copied!",
      severity: "info",
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading skeletons
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Coupons
        </Typography>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          My Coupons
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          size={isMobile ? "small" : "medium"}
        >
          {isMobile ? "Add" : "Create Coupon"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* No coupons placeholder */}
      {coupons.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No coupons created yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Create Your First Coupon
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {coupons.map((coupon, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={coupon._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      "&:hover": {
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {coupon.code}
                        </Typography>
                        <Chip
                          label={coupon.status}
                          color={
                            coupon.status === "active" ? "success" : "default"
                          }
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {coupon.type === "percentage"
                          ? `${coupon.value}% off`
                          : `$${coupon.value} off`}
                      </Typography>
                      <Typography variant="body2">
                        Min booking: ${coupon.minBookingAmount || 0}
                      </Typography>
                      <Typography variant="body2">
                        Valid: {formatDate(coupon.startDate)} –{" "}
                        {formatDate(coupon.endDate)}
                      </Typography>
                      <Typography variant="body2">
                        Used: {coupon.usedCount || 0} /{" "}
                        {coupon.usageLimit || "∞"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                        {coupon.description || "No description"}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Tooltip title="Copy code">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(coupon)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteDialog({ open: true, coupon })
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>{editMode ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                error={!!formErrors.code}
                helperText={formErrors.code}
                required
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
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
                  formData.type === "percentage"
                    ? "Percentage (%)"
                    : "Amount ($)"
                }
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                error={!!formErrors.value}
                helperText={formErrors.value}
                required
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: formData.type === "percentage" ? 1 : 0.01,
                  },
                }}
              />
            </Grid>
            {formData.type === "percentage" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Discount ($) (optional)"
                  name="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Min Booking Amount ($)"
                name="minBookingAmount"
                type="number"
                value={formData.minBookingAmount}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit (optional)"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={!!formErrors.endDate}
                helperText={formErrors.endDate}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Applicable Parkings</InputLabel>
                <Select
                  multiple
                  value={formData.applicableParkings}
                  onChange={handleParkingsChange}
                  renderValue={(selected) => {
                    if (selected.length === 0) return "All parkings";
                    return selected
                      .map((id) => parkings.find((p) => p._id === id)?.name)
                      .join(", ");
                  }}
                >
                  {parkings.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? "active" : "inactive",
                      })
                    }
                  />
                }
                label="Active"
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, coupon: null })}
      >
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          Are you sure you want to delete coupon{" "}
          <strong>{deleteDialog.coupon?.code}</strong>?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, coupon: null })}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerCoupons;
