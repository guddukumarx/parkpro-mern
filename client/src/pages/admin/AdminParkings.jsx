// src/pages/admin/AdminParkings.jsx
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Skeleton,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
  useTheme,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalParking as ParkingIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case "active":
      color = theme.palette.success.main;
      break;
    case "inactive":
      color = theme.palette.warning.main;
      break;
    case "maintenance":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.grey[500];
  }
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: 600,
  };
});

const AdminParkings = () => {
  const theme = useTheme();

  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // items per page

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    city: "",
    pricePerHour: "",
    status: "active",
  });
  const [editErrors, setEditErrors] = useState({});

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchParkings();
  }, [page, statusFilter]);

  const fetchParkings = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: statusFilter || undefined,
        page,
        limit,
      };
      const res = await adminService.getAllParkings(params);
      setParkings(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      setError(err.message || "Failed to load parkings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchParkings();
  };

  const handleEditClick = (parking) => {
    setEditingParking(parking);
    setEditForm({
      name: parking.name || "",
      address: parking.address || "",
      city: parking.city || "",
      pricePerHour: parking.pricePerHour?.toString() || "",
      status: parking.status || "active",
    });
    setEditErrors({});
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingParking(null);
  };

  const validateEdit = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    if (!editForm.address.trim()) errors.address = "Address is required";
    if (!editForm.city.trim()) errors.city = "City is required";
    if (!editForm.pricePerHour)
      errors.pricePerHour = "Price per hour is required";
    else if (
      isNaN(editForm.pricePerHour) ||
      Number(editForm.pricePerHour) <= 0
    ) {
      errors.pricePerHour = "Price must be positive";
    }
    return errors;
  };

  const handleEditSave = async () => {
    const errors = validateEdit();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const updatedData = {
        name: editForm.name,
        address: editForm.address,
        city: editForm.city,
        pricePerHour: parseFloat(editForm.pricePerHour),
        status: editForm.status,
      };
      await adminService.updateParkingAdmin(editingParking._id, updatedData);
      setSnackbar({
        open: true,
        message: "Parking updated successfully",
        severity: "success",
      });
      handleEditClose();
      fetchParkings();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Update failed",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (parking) => {
    setParkingToDelete(parking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteParkingAdmin(parkingToDelete._id);
      setSnackbar({
        open: true,
        message: "Parking deleted",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      fetchParkings();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
        severity: "error",
      });
    }
  };

  const filteredParkings = parkings.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Manage Parkings
        </Typography>
        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchParkings}
            disabled={loading}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name or city"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Parking Cards */}
      {loading ? (
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
      ) : filteredParkings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No parkings found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredParkings.map((parking) => (
              <Grid item xs={12} sm={6} md={4} key={parking._id}>
                <StyledCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" noWrap>
                        {parking.name}
                      </Typography>
                      <StyledChip
                        label={parking.status || "active"}
                        size="small"
                        status={parking.status}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.secondary }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {parking.address}, {parking.city}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <MoneyIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.secondary }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${parking.pricePerHour}/hr
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Slots: {parking.totalSlots || 0} (available:{" "}
                      {parking.availableSlots || 0})
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Owner: {parking.owner?.name || "N/A"}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-around", p: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(parking)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(parking)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Parking</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                error={!!editErrors.name}
                helperText={editErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                error={!!editErrors.address}
                helperText={editErrors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({ ...editForm, city: e.target.value })
                }
                error={!!editErrors.city}
                helperText={editErrors.city}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price per hour ($)"
                name="pricePerHour"
                type="number"
                value={editForm.pricePerHour}
                onChange={(e) =>
                  setEditForm({ ...editForm, pricePerHour: e.target.value })
                }
                error={!!editErrors.pricePerHour}
                helperText={editErrors.pricePerHour}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Parking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{parkingToDelete?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default AdminParkings;
