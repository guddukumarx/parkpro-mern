// src/pages/admin/AdminOwnerApprovals.jsx
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
  Avatar,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const AdminOwnerApprovals = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({ open: false, reason: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getPendingOwners();
      setPendingOwners(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to load pending owners");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ownerId) => {
    try {
      await adminService.approveOwner(ownerId);
      setSnackbar({
        open: true,
        message: "Owner approved successfully",
        severity: "success",
      });
      fetchPendingOwners();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Approval failed",
        severity: "error",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedOwner) return;
    try {
      await adminService.rejectOwner(selectedOwner._id, rejectDialog.reason);
      setSnackbar({
        open: true,
        message: "Owner rejected",
        severity: "success",
      });
      setRejectDialog({ open: false, reason: "" });
      setSelectedOwner(null);
      fetchPendingOwners();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Rejection failed",
        severity: "error",
      });
    }
  };

  const openRejectDialog = (owner) => {
    setSelectedOwner(owner);
    setRejectDialog({ open: true, reason: "" });
  };

  const closeRejectDialog = () => {
    setRejectDialog({ open: false, reason: "" });
    setSelectedOwner(null);
  };

  // Animation variants
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
          Owner Approvals
        </Typography>
        <IconButton
          onClick={fetchPendingOwners}
          disabled={loading}
          color="primary"
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Pending owners grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <AnimatePresence>
          {pendingOwners.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert severity="info">No pending owner requests.</Alert>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                {pendingOwners.map((owner) => (
                  <Grid item xs={12} sm={6} md={4} key={owner._id}>
                    <motion.div variants={itemVariants}>
                      <StyledCard>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              src={owner.avatar}
                              sx={{
                                width: 48,
                                height: 48,
                                mr: 2,
                                bgcolor: "primary.main",
                              }}
                            >
                              {owner.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" noWrap>
                                {owner.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {owner.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Phone: {owner.phone || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Registered:{" "}
                            {new Date(owner.createdAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{ justifyContent: "space-between", p: 2, pt: 0 }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleApprove(owner._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<RejectIcon />}
                            onClick={() => openRejectDialog(owner)}
                          >
                            Reject
                          </Button>
                        </CardActions>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={closeRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Owner</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Are you sure you want to reject {selectedOwner?.name}?
          </Typography>
          <TextField
            fullWidth
            label="Reason (optional)"
            multiline
            rows={3}
            value={rejectDialog.reason}
            onChange={(e) =>
              setRejectDialog({ ...rejectDialog, reason: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject
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
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminOwnerApprovals;
