// src/pages/owner/ManageSlots.jsx
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
  Snackbar,
  Alert,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalParking as ParkingIcon,
  DirectionsCar as CarIcon,
  EventSeat as SeatIcon,
  Accessible as AccessibleIcon,
  Power as PowerIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import parkingService from "../../services/parkingService";
import { motion, AnimatePresence } from "framer-motion";
import {
  connectSocket,
  joinParkingRoom,
  leaveParkingRoom,
  onSlotUpdate,
  disconnectSocket,
} from "../../services/socketService";

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  height: "100%",
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.text.primary,
  marginRight: theme.spacing(2),
}));

const SlotCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case "available":
      color = theme.palette.success.main;
      break;
    case "booked":
    case "occupied":
      color = theme.palette.primary.main;
      break;
    case "reserved":
      color = theme.palette.info.main;
      break;
    case "maintenance":
      color = theme.palette.warning.main;
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

const FilterBar = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ManageSlots = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { parkingId } = useParams();
  // State for parking selection
  const [parkings, setParkings] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState("");
  const [loadingParkings, setLoadingParkings] = useState(true);

  // State for slots
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotNumber: "",
    type: "Standard",
    pricePerHour: "",
    status: "available",
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch owner's parkings on mount
  useEffect(() => {
    fetchParkings();
  }, []);

  // Check URL for parkingId after parkings load
  useEffect(() => {
    if (parkings.length > 0) {
      if (parkingId && parkings.some((p) => p._id === parkingId)) {
        setSelectedParkingId(parkingId);
      } else if (!selectedParkingId) {
        setSelectedParkingId(parkings[0]._id);
      }
    }
  }, [parkings]);

  // Fetch slots when selectedParkingId changes
  useEffect(() => {
    if (selectedParkingId) {
      fetchSlots();
      // Connect to socket for real-time updates
      connectSocket();
      joinParkingRoom(selectedParkingId);
      onSlotUpdate((updatedSlot) => {
        setSlots((prev) =>
          prev.map((s) => (s._id === updatedSlot._id ? updatedSlot : s)),
        );
      });
    }
    return () => {
      if (selectedParkingId) leaveParkingRoom(selectedParkingId);
      disconnectSocket();
    };
  }, [selectedParkingId]);

  const fetchParkings = async () => {
    try {
      setLoadingParkings(true);
      const response = await parkingService.getOwnerParkings();
      const parkingsData = response.data || response;
      setParkings(parkingsData);
    } catch (error) {
      console.error("Failed to fetch parkings:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to load parkings",
        severity: "error",
      });
    } finally {
      setLoadingParkings(false);
    }
  };

  const fetchSlots = async () => {
    if (!selectedParkingId) return;
    try {
      setLoadingSlots(true);
      const response =
        await parkingService.getSlotsByParking(selectedParkingId);

      const slotsData = response.data || response;
      setSlots(slotsData);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to load slots",
        severity: "error",
      });
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Compute stats
  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s.status === "available").length;
  const bookedSlots = slots.filter(
    (s) => s.status === "booked" || s.status === "occupied",
  ).length;
  const maintenanceSlots = slots.filter(
    (s) => s.status === "maintenance",
  ).length;

  // Filter slots
  const filteredSlots = slots.filter((slot) => {
    const matchesSearch =
      slot.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "booked" &&
        (slot.status === "booked" || slot.status === "occupied")) ||
      slot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.slotNumber.trim())
      errors.slotNumber = "Slot number is required";
    if (!formData.pricePerHour) errors.pricePerHour = "Price is required";
    else if (
      isNaN(formData.pricePerHour) ||
      Number(formData.pricePerHour) <= 0
    ) {
      errors.pricePerHour = "Price must be a positive number";
    }
    return errors;
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({
      slotNumber: "",
      type: "Standard",
      pricePerHour: "",
      status: "available",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleEditClick = (slot) => {
    setEditMode(true);
    setCurrentSlot(slot);
    setFormData({
      slotNumber: slot.slotNumber,
      type: slot.type,
      pricePerHour: slot.pricePerHour.toString(),
      status: slot.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Map frontend values to backend enum
    const typeMap = {
      Standard: "car",
      VIP: "car", // or use a separate type like 'vip' if added to model
      Handicapped: "disabled",
      Electric: "electric",
    };

    const statusMap = {
      available: "available",
      booked: "booked",
      reserved: "booked", // treat reserved as booked, or add 'reserved' to model
      maintenance: "maintenance",
    };

    const slotData = {
      slotNumber: formData.slotNumber,
      type: typeMap[formData.type] || "car",
      pricePerHour: parseFloat(formData.pricePerHour),
      status: statusMap[formData.status] || "available",
    };

    try {
      if (editMode) {
        const updatedSlot = await parkingService.updateSlot(
          currentSlot._id,
          slotData,
        );
        setSlots(
          slots.map((s) => (s._id === currentSlot._id ? updatedSlot.data : s)),
        );
        setSnackbar({
          open: true,
          message: "Slot updated successfully!",
          severity: "success",
        });
      } else {
        const newSlot = await parkingService.addSlot(
          selectedParkingId,
          slotData,
        );
        setSlots([...slots, newSlot.data]);
        setSnackbar({
          open: true,
          message: "Slot added successfully!",
          severity: "success",
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await parkingService.deleteSlot(slotToDelete._id);
      setSlots(slots.filter((s) => s._id !== slotToDelete._id));
      setSnackbar({
        open: true,
        message: "Slot deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Delete failed",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (slot, newStatus) => {
    try {
      const updatedSlot = await parkingService.updateSlot(slot._id, {
        status: newStatus,
      });
      setSlots(slots.map((s) => (s._id === slot._id ? updatedSlot.data : s)));
      setSnackbar({ open: true, message: "Status updated!", severity: "info" });
    } catch (error) {
      console.error("Status change error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to update status",
        severity: "error",
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "VIP":
        return <SeatIcon />;
      case "Handicapped":
        return <AccessibleIcon />;
      case "Electric":
        return <PowerIcon />;
      default:
        return <CarIcon />;
    }
  };

  const isLoading = loadingParkings || loadingSlots;

  // Determine grid columns based on screen size
  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4; // desktop: 3 items per row (12/4=3)
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <PageHeader>
          <Typography
            variant="h4"
            component="h1"
            color="text.primary"
            fontWeight={700}
          >
            Manage Slots
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Parking selector */}
            <FormControl size="small" sx={{ minWidth: isMobile ? 150 : 200 }}>
              <InputLabel>Select Parking</InputLabel>
              <Select
                value={selectedParkingId}
                label="Select Parking"
                onChange={(e) => setSelectedParkingId(e.target.value)}
                disabled={loadingParkings}
              >
                {parkings.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchSlots} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              disabled={!selectedParkingId || isLoading}
              sx={{ color: theme.palette.text.primary }}
            >
              Add Slot
            </Button>
          </Box>
        </PageHeader>

        {/* Summary Stats - responsive grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard>
              <IconWrapper color={theme.palette.info.main}>
                <ParkingIcon />
              </IconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Slots
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {loadingSlots ? <Skeleton width={40} /> : totalSlots}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard>
              <IconWrapper color={theme.palette.success.main}>
                <CarIcon />
              </IconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Available
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {loadingSlots ? <Skeleton width={40} /> : availableSlots}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard>
              <IconWrapper color={theme.palette.primary.main}>
                <CarIcon />
              </IconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Occupied
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {loadingSlots ? <Skeleton width={40} /> : bookedSlots}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard>
              <IconWrapper color={theme.palette.warning.main}>
                <SeatIcon />
              </IconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Maintenance
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {loadingSlots ? <Skeleton width={40} /> : maintenanceSlots}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>

        {/* Search and Filter Bar - responsive */}
        <FilterBar elevation={1}>
          <TextField
            placeholder="Search by slot number or type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              flex: isMobile ? "1 1 100%" : 1,
              minWidth: isMobile ? "100%" : 250,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            disabled={isLoading}
          />
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="booked">Booked/Occupied</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </FilterBar>

        {/* Slots Grid with Animation */}
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AnimatePresence>
            {filteredSlots.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No slots found
                  </Typography>
                  {!selectedParkingId ? (
                    <Typography color="text.secondary">
                      Please select a parking location.
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddClick}
                      sx={{ mt: 2 }}
                    >
                      Add Your First Slot
                    </Button>
                  )}
                </Paper>
              </motion.div>
            ) : (
              <Grid
                container
                spacing={3}
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredSlots.map((slot) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={slot._id}
                    component={motion.div}
                    variants={itemVariants}
                  >
                    <SlotCard>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconWrapper
                              color={theme.palette.primary.main}
                              sx={{ width: 40, height: 40, mr: 1 }}
                            >
                              {getTypeIcon(slot.type)}
                            </IconWrapper>
                            <Typography variant="h6" color="text.secondary">
                              {slot.slotNumber}
                            </Typography>
                          </Box>
                          <StatusChip
                            label={slot.status}
                            size="small"
                            status={slot.status}
                          />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Type:</strong> {slot.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Price:</strong> $
                            {slot.pricePerHour?.toFixed(2)}/hr
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-around", p: 1 }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(slot)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(slot)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Status">
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                              value={slot.status}
                              onChange={(e) =>
                                handleStatusChange(slot, e.target.value)
                              }
                              displayEmpty
                              size="small"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              <MenuItem value="available">Available</MenuItem>
                              <MenuItem value="booked">Booked</MenuItem>
                              <MenuItem value="reserved">Reserved</MenuItem>
                              <MenuItem value="maintenance">
                                Maintenance
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </CardActions>
                    </SlotCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </AnimatePresence>
        )}

        {/* Add/Edit Modal */}
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editMode ? "Edit Slot" : "Add New Slot"}</DialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Slot Number"
                name="slotNumber"
                value={formData.slotNumber}
                onChange={handleInputChange}
                error={!!formErrors.slotNumber}
                helperText={formErrors.slotNumber}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="Handicapped">Handicapped</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Price per hour ($)"
                name="pricePerHour"
                type="number"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                error={!!formErrors.pricePerHour}
                helperText={formErrors.pricePerHour}
                margin="normal"
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="booked">Booked</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete slot {slotToDelete?.slotNumber}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
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
    </Box>
  );
};

export default ManageSlots;
