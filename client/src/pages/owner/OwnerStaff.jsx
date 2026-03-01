import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  Snackbar,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ownerService from "../../services/ownerService";

const OwnerStaff = () => {
  const [staff, setStaff] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    parkings: [],
    permissions: {
      manageSlots: false,
      viewBookings: false,
      manageBookings: false,
      viewReports: false,
      manageStaff: false,
    },
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    assignment: null,
  });

  // Snackbar
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
      const [staffRes, parkingsRes] = await Promise.all([
        ownerService.getStaff(),
        ownerService.getParkings(),
      ]);
      setStaff(staffRes.data || staffRes);
      setParkings(parkingsRes.data || parkingsRes);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentAssignment(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      parkings: [],
      permissions: {
        manageSlots: false,
        viewBookings: false,
        manageBookings: false,
        viewReports: false,
        manageStaff: false,
      },
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (assignment) => {
    setEditMode(true);
    setCurrentAssignment(assignment);
    setFormData({
      name: assignment.staff.name,
      email: assignment.staff.email,
      password: "", // leave blank
      phone: assignment.staff.phone || "",
      parkings: assignment.parkings.map((p) => p._id),
      permissions: { ...assignment.permissions },
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

  const handlePermissionChange = (perm) => (e) => {
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [perm]: e.target.checked },
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name required";
    if (!formData.email.trim()) errors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";
    if (!editMode && !formData.password)
      errors.password = "Password required for new staff";
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
        await ownerService.updateStaff(currentAssignment._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          parkings: formData.parkings,
          permissions: formData.permissions,
          ...(formData.password && { password: formData.password }),
        });
        setSnackbar({
          open: true,
          message: "Staff updated",
          severity: "success",
        });
      } else {
        await ownerService.createStaff({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          parkings: formData.parkings,
          permissions: formData.permissions,
        });
        setSnackbar({
          open: true,
          message: "Staff created",
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
      await ownerService.deleteStaff(deleteDialog.assignment._id);
      setSnackbar({
        open: true,
        message: "Staff deleted",
        severity: "success",
      });
      setDeleteDialog({ open: false, assignment: null });
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
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Staff
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Assigned Parkings</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No staff added yet.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.staff.name}</TableCell>
                  <TableCell>{a.staff.email}</TableCell>
                  <TableCell>{a.staff.phone || "-"}</TableCell>
                  <TableCell>
                    {a.parkings.length === 0
                      ? "All parkings"
                      : a.parkings.map((p) => p.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    {Object.entries(a.permissions)
                      .filter(([_, val]) => val)
                      .map(([key]) => key.replace("manage", ""))
                      .join(", ") || "None"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenEdit(a)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setDeleteDialog({ open: true, assignment: a })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editMode ? "Edit Staff" : "Add Staff"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={
                  formErrors.password ||
                  (editMode ? "Leave blank to keep current" : "")
                }
                required={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assigned Parkings</InputLabel>
                <Select
                  multiple
                  value={formData.parkings}
                  onChange={(e) =>
                    setFormData({ ...formData, parkings: e.target.value })
                  }
                  renderValue={(selected) =>
                    selected.length === 0
                      ? "All parkings"
                      : selected
                          .map((id) => parkings.find((p) => p._id === id)?.name)
                          .join(", ")
                  }
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
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.manageSlots}
                        onChange={handlePermissionChange("manageSlots")}
                      />
                    }
                    label="Manage Slots"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.viewBookings}
                        onChange={handlePermissionChange("viewBookings")}
                      />
                    }
                    label="View Bookings"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.manageBookings}
                        onChange={handlePermissionChange("manageBookings")}
                      />
                    }
                    label="Manage Bookings (Check-in/out)"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.viewReports}
                        onChange={handlePermissionChange("viewReports")}
                      />
                    }
                    label="View Reports"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissions.manageStaff}
                        onChange={handlePermissionChange("manageStaff")}
                      />
                    }
                    label="Manage Staff"
                  />
                </Grid>
              </Grid>
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, assignment: null })}
      >
        <DialogTitle>Delete Staff</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteDialog.assignment?.staff.name}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, assignment: null })}
          >
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

export default OwnerStaff;
