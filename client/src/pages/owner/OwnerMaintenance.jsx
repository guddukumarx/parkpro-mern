// src/pages/owner/OwnerMaintenance.jsx
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  Fab,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: theme.palette.warning.main,
    "in-progress": theme.palette.info.main,
    resolved: theme.palette.success.main,
    closed: theme.palette.grey[500],
  };
  return {
    backgroundColor: colors[status] || theme.palette.grey[500],
    color: "#fff",
    fontWeight: 600,
  };
});

const PriorityChip = styled(Chip)(({ theme, priority }) => {
  const colors = {
    low: theme.palette.success.light,
    medium: theme.palette.info.light,
    high: theme.palette.warning.light,
    critical: theme.palette.error.light,
  };
  return {
    backgroundColor: colors[priority] || theme.palette.grey[300],
    color: theme.palette.getContrastText(
      colors[priority] || theme.palette.grey[300],
    ),
  };
});

const OwnerMaintenance = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [requests, setRequests] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Create modal
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    parkingId: "",
    slotId: "",
    title: "",
    description: "",
    priority: "medium",
  });
  const [formErrors, setFormErrors] = useState({});

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    request: null,
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

  useEffect(() => {
    if (createModal) fetchParkings();
  }, [createModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const reqRes = await ownerService.getMaintenanceRequests();
      setRequests(reqRes.data || reqRes);
    } catch (err) {
      setError(err.message || "Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchParkings = async () => {
    try {
      const res = await ownerService.getParkings();
      setParkings(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    const errors = {};
    if (!formData.parkingId) errors.parkingId = "Parking is required";
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    try {
      await ownerService.createMaintenanceRequest(formData);
      setSnackbar({
        open: true,
        message: "Request created",
        severity: "success",
      });
      setCreateModal(false);
      setFormData({
        parkingId: "",
        slotId: "",
        title: "",
        description: "",
        priority: "medium",
      });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Creation failed",
        severity: "error",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await ownerService.updateMaintenanceRequest(editRequest._id, {
        status: editStatus,
        resolutionNotes: editNotes,
      });
      setSnackbar({
        open: true,
        message: "Request updated",
        severity: "success",
      });
      setEditModal(false);
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Update failed",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await ownerService.deleteMaintenanceRequest(deleteDialog.request._id);
      setSnackbar({
        open: true,
        message: "Request deleted",
        severity: "success",
      });
      setDeleteDialog({ open: false, request: null });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
        severity: "error",
      });
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    const matchesSearch = searchTerm
      ? req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.parking?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Maintenance Requests
        </Typography>
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setCreateModal(true)}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <AddIcon sx={{ mr: 1 }} /> Add
        </Fab>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModal(true)}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          New Request
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title or parking"
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Requests Grid */}
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
      ) : filteredRequests.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No maintenance requests found
          </Typography>
          <Button variant="contained" onClick={() => setCreateModal(true)}>
            Create your first request
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
              {filteredRequests.map((req) => (
                <Grid item xs={12} sm={6} md={4} key={req._id}>
                  <motion.div
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" component="h2" noWrap>
                            {req.title}
                          </Typography>
                          <StatusChip
                            label={req.status}
                            size="small"
                            status={req.status}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {req.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <PriorityChip
                            label={req.priority}
                            size="small"
                            priority={req.priority}
                          />
                          <Chip
                            label={req.parking?.name}
                            size="small"
                            variant="outlined"
                          />
                          {req.slot && (
                            <Chip
                              label={`Slot ${req.slot.slotNumber}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        {req.resolutionNotes && (
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: "action.hover",
                              p: 1,
                              borderRadius: 1,
                            }}
                          >
                            <strong>Notes:</strong> {req.resolutionNotes}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-around", p: 2, pt: 0 }}
                      >
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setEditRequest(req);
                            setEditStatus(req.status);
                            setEditNotes(req.resolutionNotes || "");
                            setEditModal(true);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            setDeleteDialog({ open: true, request: req })
                          }
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        </motion.div>
      )}

      {/* Create Modal */}
      <Dialog
        open={createModal}
        onClose={() => setCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Maintenance Request</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.parkingId}>
                <InputLabel>Parking *</InputLabel>
                <Select
                  value={formData.parkingId}
                  label="Parking *"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parkingId: e.target.value,
                      slotId: "",
                    })
                  }
                >
                  {parkings.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.parkingId && (
                  <Typography color="error" variant="caption">
                    {formErrors.parkingId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            {formData.parkingId && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Slot (optional)</InputLabel>
                  <Select
                    value={formData.slotId}
                    label="Slot (optional)"
                    onChange={(e) =>
                      setFormData({ ...formData, slotId: e.target.value })
                    }
                  >
                    <MenuItem value="">None (whole parking)</MenuItem>
                    {parkings
                      .find((p) => p._id === formData.parkingId)
                      ?.slots?.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.slotNumber}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Request</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStatus}
                  label="Status"
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resolution Notes"
                multiline
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, request: null })}
      >
        <DialogTitle>Delete Request</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteDialog.request?.title}"?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, request: null })}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
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

export default OwnerMaintenance;
