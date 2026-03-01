// src/pages/admin/AdminBookings.jsx
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
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";
import { format } from "date-fns";

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

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case "confirmed":
      color = theme.palette.info.main;
      break;
    case "active":
      color = theme.palette.success.main;
      break;
    case "completed":
      color = theme.palette.grey[500];
      break;
    case "cancelled":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.warning.main; // pending etc.
  }
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: 600,
  };
});

const ManageBookings = () => {
  const theme = useTheme();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // items per page

  // Refund dialog
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundBooking, setRefundBooking] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, dateFrom, dateTo]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit,
      };
      const res = await adminService.getAllBookings(params);
      setBookings(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchBookings();
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    fetchBookings();
  };

  const handleRefundClick = (booking) => {
    setRefundBooking(booking);
    setRefundReason("");
    setRefundDialogOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!refundBooking) return;
    setRefundLoading(true);
    try {
      await adminService.issueRefund(refundBooking._id, {
        reason: refundReason,
      });
      setSnackbar({
        open: true,
        message: "Refund processed successfully",
        severity: "success",
      });
      setRefundDialogOpen(false);
      fetchBookings();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Refund failed",
        severity: "error",
      });
    } finally {
      setRefundLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      b.user?.name?.toLowerCase().includes(searchLower) ||
      b.parking?.name?.toLowerCase().includes(searchLower) ||
      b._id?.toLowerCase().includes(searchLower)
    );
  });

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
          Manage Bookings
        </Typography>
        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchBookings}
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
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search user, parking, booking ID"
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
          <Grid item xs={12} sm={2} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              disabled={loading}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={220}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : filteredBookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking._id}>
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
                      <Typography variant="subtitle2" color="text.secondary">
                        ID: {booking._id.slice(-8)}
                      </Typography>
                      <StatusChip
                        label={booking.status}
                        size="small"
                        status={booking.status}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {booking.parking?.name || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      User: {booking.user?.name} ({booking.user?.email})
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Slot: {booking.slot?.slotNumber || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {booking.startTime
                        ? format(new Date(booking.startTime), "MMM dd, HH:mm")
                        : "N/A"}{" "}
                      –{" "}
                      {booking.endTime
                        ? format(new Date(booking.endTime), "MMM dd, HH:mm")
                        : "N/A"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        ${booking.totalPrice?.toFixed(2)}
                      </Typography>
                      <Chip
                        label={booking.paymentStatus || "pending"}
                        size="small"
                        color={
                          booking.paymentStatus === "paid"
                            ? "success"
                            : "warning"
                        }
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                    {booking.paymentStatus === "paid" && (
                      <Tooltip title="Issue Refund">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRefundClick(booking)}
                        >
                          <PaymentIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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

      {/* Refund Dialog */}
      <Dialog
        open={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Issue Refund</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            Booking: {refundBooking?.parking?.name} (Slot{" "}
            {refundBooking?.slot?.slotNumber})
          </Typography>
          <Typography variant="body2" gutterBottom>
            Amount: ${refundBooking?.totalPrice?.toFixed(2)}
          </Typography>
          <TextField
            fullWidth
            label="Reason (optional)"
            multiline
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleRefundConfirm}
            disabled={refundLoading}
          >
            {refundLoading ? "Processing..." : "Confirm Refund"}
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

export default ManageBookings;
