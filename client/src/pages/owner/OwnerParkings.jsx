// src/pages/owner/OwnerParkings.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalParking as ParkingIcon,
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Gavel as GavelIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import parkingService from "../../services/parkingService";

// Styled components with animations
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const ParkingCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  flex: "1 1 auto",
  minWidth: 0,
}));

const OwnerParkings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentParking, setCurrentParking] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    pricePerHour: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
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
  }, []);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const res = await parkingService.getOwnerParkings();
      setParkings(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to load parkings");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditMode(false);
    setCurrentParking(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      pricePerHour: "",
      description: "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (parking) => {
    setEditMode(true);
    setCurrentParking(parking);
    setFormData({
      name: parking.name || "",
      address: parking.address || "",
      city: parking.city || "",
      pricePerHour: parking.pricePerHour?.toString() || "",
      description: parking.description || "",
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

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.pricePerHour)
      errors.pricePerHour = "Price per hour is required";
    else if (
      isNaN(formData.pricePerHour) ||
      Number(formData.pricePerHour) <= 0
    ) {
      errors.pricePerHour = "Price must be a positive number";
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
      const parkingData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        pricePerHour: parseFloat(formData.pricePerHour),
        description: formData.description,
      };

      if (editMode) {
        await parkingService.updateParking(currentParking._id, parkingData);
        setSnackbar({
          open: true,
          message: "Parking updated",
          severity: "success",
        });
      } else {
        await parkingService.createParking(parkingData);
        setSnackbar({
          open: true,
          message: "Parking created",
          severity: "success",
        });
      }
      handleCloseModal();
      fetchParkings();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (parking) => {
    setParkingToDelete(parking);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await parkingService.deleteParking(parkingToDelete._id);
      setSnackbar({
        open: true,
        message: "Parking deleted",
        severity: "success",
      });
      fetchParkings();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleManageSlots = (parkingId) => {
    navigate(`/owner/parkings/${parkingId}/slots`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Parkings
        </Typography>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, i) => (
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
      <PageHeader>
        <Typography variant="h4" component="h1" fontWeight={700}>
          My Parkings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          size={isMobile ? "small" : "medium"}
        >
          Add New Parking
        </Button>
      </PageHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {parkings.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ParkingIcon
            sx={{ fontSize: 80, color: theme.palette.grey[400], mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No parkings yet
          </Typography>
          <Button variant="contained" onClick={handleOpenAddModal}>
            Add Your First Parking
          </Button>
        </Box>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <AnimatePresence>
              {parkings.map((parking) => (
                <Grid item xs={12} sm={6} md={4} key={parking._id}>
                  <motion.div
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ParkingCard>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" component="h2" noWrap>
                            {parking.name}
                          </Typography>
                          <Chip
                            label={parking.status || "active"}
                            size="small"
                            color={
                              parking.status === "active"
                                ? "success"
                                : "default"
                            }
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {parking.address}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {parking.city}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Price:</strong> ${parking.pricePerHour}/hr
                        </Typography>
                        <Typography variant="body2">
                          <strong>Total Slots:</strong>{" "}
                          {parking.totalSlots || 0}
                        </Typography>
                        {parking.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {parking.description}
                          </Typography>
                        )}
                      </CardContent>

                      <CardActions
                        sx={{
                          flexWrap: "wrap",
                          justifyContent: "center",
                          p: 1,
                        }}
                      >
                        <ActionButton
                          size="small"
                          variant="outlined"
                          onClick={() => handleManageSlots(parking._id)}
                        >
                          Slots
                        </ActionButton>
                        <ActionButton
                          size="small"
                          component={Link}
                          to={`/owner/parkings/${parking._id}/blacklist`}
                        >
                          Blacklist
                        </ActionButton>
                        <ActionButton
                          size="small"
                          component={Link}
                          to={`/owner/parkings/${parking._id}/hours`}
                        >
                          Hours
                        </ActionButton>
                        <ActionButton
                          size="small"
                          component={Link}
                          to={`/owner/parkings/${parking._id}/cancellation`}
                        >
                          Cancel
                        </ActionButton>
                        <ActionButton
                          size="small"
                          component={Link}
                          to={`/owner/parkings/${parking._id}/pricing`}
                        >
                          Pricing
                        </ActionButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditModal(parking)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(parking)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </ParkingCard>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Parking" : "Add New Parking"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parking Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price per hour ($)"
                name="pricePerHour"
                type="number"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                error={!!formErrors.pricePerHour}
                helperText={formErrors.pricePerHour}
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
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
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Parking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{parkingToDelete?.name}"? This will
            also delete all slots and associated bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default OwnerParkings;
