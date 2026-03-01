// src/pages/admin/AdminPayments.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Tooltip,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Badge,
  Zoom,
  Fade,
  Grow,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  LocalParking as ParkingIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays } from "date-fns";
import adminService from "../../services/adminService";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const statusColors = {
  paid: "success",
  pending: "warning",
  failed: "error",
  refunded: "info",
  partially_refunded: "secondary",
  disputed: "error",
  cancelled: "default",
  processing: "info",
  on_hold: "warning",
};

const paymentMethods = ["card", "cash", "online", "wallet", "bank_transfer"];

const AdminPayments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Summary state
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    partially_refunded: 0,
    disputed: 0,
  });

  // Status update modal
  const [statusUpdateDialog, setStatusUpdateDialog] = useState({
    open: false,
    booking: null,
    newStatus: "",
    reason: "",
  });

  // Refund modal
  const [refundDialog, setRefundDialog] = useState({
    open: false,
    booking: null,
    amount: "",
    reason: "",
  });

  // Details modal
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    booking: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: statusFilter || undefined,
        paymentMethod: paymentMethodFilter || undefined,
        dateFrom: dateRange.from || undefined,
        dateTo: dateRange.to || undefined,
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
      };
      const res = await adminService.getAllBookings(params);
      const allBookings = res.data || res;
      // Filter only those with payment info
      const paymentsData = allBookings.filter(
        (b) => b.paymentStatus && b.paymentStatus !== "",
      );
      setPayments(paymentsData);
      if (res.pagination) setTotal(res.pagination.total);

      // Compute summary (could be separate API, but we'll use current data)
      computeSummary(paymentsData);
    } catch (err) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [
    page,
    rowsPerPage,
    statusFilter,
    paymentMethodFilter,
    dateRange.from,
    dateRange.to,
    orderBy,
    order,
  ]);

  const computeSummary = (data) => {
    const sums = {
      total: 0,
      paid: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      partially_refunded: 0,
      disputed: 0,
    };
    data.forEach((b) => {
      sums.total += b.totalPrice || 0;
      const status = b.paymentStatus;
      if (sums.hasOwnProperty(status)) {
        sums[status] += b.totalPrice || 0;
      }
    });
    setSummary(sums);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = () => {
    setPage(0);
    fetchPayments();
  };

  const handleStatusUpdateClick = (booking) => {
    setStatusUpdateDialog({
      open: true,
      booking,
      newStatus: booking.paymentStatus,
      reason: "",
    });
  };

  const handleStatusUpdateConfirm = async () => {
    if (!statusUpdateDialog.booking) return;
    try {
      await adminService.updatePaymentStatus(
        statusUpdateDialog.booking._id,
        statusUpdateDialog.newStatus,
        statusUpdateDialog.reason,
      );
      setSnackbar({
        open: true,
        message: `Payment status updated to ${statusUpdateDialog.newStatus}`,
        severity: "success",
      });
      setStatusUpdateDialog({
        open: false,
        booking: null,
        newStatus: "",
        reason: "",
      });
      fetchPayments();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Update failed",
        severity: "error",
      });
    }
  };

  const handleRefundClick = (booking) => {
    setRefundDialog({
      open: true,
      booking,
      amount: booking.totalPrice?.toFixed(2) || "",
      reason: "",
    });
  };

  const handleRefundConfirm = async () => {
    if (!refundDialog.booking) return;
    try {
      await adminService.issueRefund(refundDialog.booking._id, {
        amount: parseFloat(refundDialog.amount),
        reason: refundDialog.reason,
      });
      setSnackbar({
        open: true,
        message: "Refund processed successfully",
        severity: "success",
      });
      setRefundDialog({ open: false, booking: null, amount: "", reason: "" });
      fetchPayments();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Refund failed",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (booking) => {
    setDetailsDialog({ open: true, booking });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtered data (client-side, but ideally server-side)
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (p) =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.parking?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [payments, searchTerm]);

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status?.replace(/_/g, " ") || "N/A"}
        color={statusColors[status] || "default"}
        size="small"
        icon={
          status === "paid" ? (
            <CheckCircleIcon />
          ) : status === "pending" ? (
            <PendingIcon />
          ) : status === "failed" ? (
            <CancelIcon />
          ) : status === "refunded" ? (
            <ReceiptIcon />
          ) : status === "partially_refunded" ? (
            <MoneyIcon />
          ) : status === "disputed" ? (
            <WarningIcon />
          ) : null
        }
      />
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <PaymentIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => format(new Date(date), "dd MMM yyyy, hh:mm a");

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
            Payment Management
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchPayments}
              disabled={loading}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "Total Revenue",
              value: summary.total,
              color: theme.palette.primary.main,
            },
            {
              label: "Paid",
              value: summary.paid,
              color: theme.palette.success.main,
            },
            {
              label: "Pending",
              value: summary.pending,
              color: theme.palette.warning.main,
            },
            {
              label: "Failed",
              value: summary.failed,
              color: theme.palette.error.main,
            },
            {
              label: "Refunded",
              value: summary.refunded,
              color: theme.palette.info.main,
            },
            {
              label: "Partially Refunded",
              value: summary.partially_refunded,
              color: theme.palette.secondary.main,
            },
            {
              label: "Disputed",
              value: summary.disputed,
              color: theme.palette.error.dark,
            },
          ].map((item, idx) => (
            <Grid item xs={6} sm={4} md={3} lg={1.7} key={idx}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    color: "#fff",
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h6">${item.value.toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {item.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by user, parking, ID, transaction"
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
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Payment Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.keys(statusColors).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethodFilter}
                  label="Payment Method"
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button variant="outlined" onClick={handleSearch} fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Table / Cards */}
        {loading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : filteredPayments.length === 0 ? (
          <Alert severity="info">No payments found.</Alert>
        ) : isMobile ? (
          // Mobile Card View
          <Grid container spacing={2}>
            <AnimatePresence>
              {filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <Grid item xs={12} key={payment._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card>
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              ID: {payment._id.slice(-8)}
                            </Typography>
                            {getStatusChip(payment.paymentStatus)}
                          </Box>
                          <Box
                            mt={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body1">
                              {payment.user?.name}
                            </Typography>
                          </Box>
                          <Box
                            mt={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <ParkingIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {payment.parking?.name}
                            </Typography>
                          </Box>
                          <Box
                            mt={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <MoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600}>
                              ${payment.totalPrice?.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box
                            mt={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <Typography variant="body2">
                              {payment.paymentMethod || "N/A"}
                            </Typography>
                          </Box>
                          <Box
                            mt={1}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <DateRangeIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(payment.createdAt)}
                            </Typography>
                          </Box>
                          {payment.transactionId && (
                            <Box mt={1}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                TXN: {payment.transactionId}
                              </Typography>
                            </Box>
                          )}
                          <Divider sx={{ my: 1.5 }} />
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<InfoIcon />}
                              onClick={() => handleViewDetails(payment)}
                            >
                              Details
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleStatusUpdateClick(payment)}
                            >
                              Update Status
                            </Button>
                            {payment.paymentStatus === "paid" && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                startIcon={<ReceiptIcon />}
                                onClick={() => handleRefundClick(payment)}
                              >
                                Refund
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
            </AnimatePresence>
          </Grid>
        ) : (
          // Desktop Table
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy === "_id" ? order : false}>
                    <TableSortLabel
                      active={orderBy === "_id"}
                      direction={orderBy === "_id" ? order : "asc"}
                      onClick={() => handleRequestSort("_id")}
                    >
                      Booking ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "user.name" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "user.name"}
                      direction={orderBy === "user.name" ? order : "asc"}
                      onClick={() => handleRequestSort("user.name")}
                    >
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "parking.name" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "parking.name"}
                      direction={orderBy === "parking.name" ? order : "asc"}
                      onClick={() => handleRequestSort("parking.name")}
                    >
                      Parking
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    sortDirection={orderBy === "totalPrice" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "totalPrice"}
                      direction={orderBy === "totalPrice" ? order : "asc"}
                      onClick={() => handleRequestSort("totalPrice")}
                    >
                      Amount ($)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell
                    sortDirection={orderBy === "paymentStatus" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "paymentStatus"}
                      direction={orderBy === "paymentStatus" ? order : "asc"}
                      onClick={() => handleRequestSort("paymentStatus")}
                    >
                      Payment Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "createdAt" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleRequestSort("createdAt")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredPayments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payment, index) => (
                      <TableRow
                        key={payment._id}
                        component={motion.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        hover
                      >
                        <TableCell>{payment._id.slice(-8)}</TableCell>
                        <TableCell>{payment.user?.name || "N/A"}</TableCell>
                        <TableCell>{payment.parking?.name || "N/A"}</TableCell>
                        <TableCell align="right">
                          ${payment.totalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            {payment.paymentMethod || "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={payment.transactionId || "N/A"}>
                            <Typography variant="body2">
                              {payment.transactionId
                                ? payment.transactionId.slice(-8)
                                : "N/A"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(payment.paymentStatus)}
                        </TableCell>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={0.5}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(payment)}
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Update Status">
                              <IconButton
                                size="small"
                                onClick={() => handleStatusUpdateClick(payment)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {payment.paymentStatus === "paid" && (
                              <Tooltip title="Issue Refund">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleRefundClick(payment)}
                                >
                                  <ReceiptIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Status Update Dialog */}
        <Dialog
          open={statusUpdateDialog.open}
          onClose={() =>
            setStatusUpdateDialog({
              open: false,
              booking: null,
              newStatus: "",
              reason: "",
            })
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Update Payment Status</Typography>
              <IconButton
                onClick={() =>
                  setStatusUpdateDialog({
                    open: false,
                    booking: null,
                    newStatus: "",
                    reason: "",
                  })
                }
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Booking
              </Typography>
              <Typography variant="body1">
                {statusUpdateDialog.booking?.parking?.name} - Slot{" "}
                {statusUpdateDialog.booking?.slot?.slotNumber}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Current Status
              </Typography>
              {getStatusChip(statusUpdateDialog.booking?.paymentStatus)}
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>New Status</InputLabel>
              <Select
                value={statusUpdateDialog.newStatus}
                label="New Status"
                onChange={(e) =>
                  setStatusUpdateDialog({
                    ...statusUpdateDialog,
                    newStatus: e.target.value,
                  })
                }
              >
                {Object.keys(statusColors).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusChip(status)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Reason (optional)"
              multiline
              rows={3}
              value={statusUpdateDialog.reason}
              onChange={(e) =>
                setStatusUpdateDialog({
                  ...statusUpdateDialog,
                  reason: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setStatusUpdateDialog({
                  open: false,
                  booking: null,
                  newStatus: "",
                  reason: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleStatusUpdateConfirm}
              disabled={!statusUpdateDialog.newStatus}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Refund Dialog */}
        <Dialog
          open={refundDialog.open}
          onClose={() =>
            setRefundDialog({
              open: false,
              booking: null,
              amount: "",
              reason: "",
            })
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Issue Refund</Typography>
              <IconButton
                onClick={() =>
                  setRefundDialog({
                    open: false,
                    booking: null,
                    amount: "",
                    reason: "",
                  })
                }
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Booking
              </Typography>
              <Typography variant="body1">
                {refundDialog.booking?.parking?.name} - Slot{" "}
                {refundDialog.booking?.slot?.slotNumber}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Original Amount
              </Typography>
              <Typography variant="h6">
                ${refundDialog.booking?.totalPrice?.toFixed(2)}
              </Typography>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Refund Amount"
              type="number"
              value={refundDialog.amount}
              onChange={(e) =>
                setRefundDialog({ ...refundDialog, amount: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Reason (optional)"
              multiline
              rows={3}
              value={refundDialog.reason}
              onChange={(e) =>
                setRefundDialog({ ...refundDialog, reason: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setRefundDialog({
                  open: false,
                  booking: null,
                  amount: "",
                  reason: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleRefundConfirm}
            >
              Process Refund
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, booking: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Payment Details</Typography>
              <IconButton
                onClick={() => setDetailsDialog({ open: false, booking: null })}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {detailsDialog.booking && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Booking ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking._id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking.transactionId || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking.user?.name} (
                    {detailsDialog.booking.user?.email})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parking
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking.parking?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Slot
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking.slot?.slotNumber} (
                    {detailsDialog.booking.slot?.type})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(detailsDialog.booking.startTime)} -{" "}
                    {formatDate(detailsDialog.booking.endTime)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${detailsDialog.booking.totalPrice?.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Box>
                    {getStatusChip(detailsDialog.booking.paymentStatus)}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.booking.paymentMethod || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment History
                  </Typography>
                  <Stepper orientation="vertical" nonLinear>
                    {detailsDialog.booking.paymentHistory?.map((entry, idx) => (
                      <Step key={idx} active>
                        <StepLabel>
                          {entry.status} - {formatDate(entry.timestamp)}
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2">
                            {entry.reason || "No reason provided"}
                          </Typography>
                        </StepContent>
                      </Step>
                    ))}
                    {!detailsDialog.booking.paymentHistory && (
                      <Step active>
                        <StepLabel>
                          {detailsDialog.booking.paymentStatus} -{" "}
                          {formatDate(detailsDialog.booking.createdAt)}
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2">
                            Initial payment
                          </Typography>
                        </StepContent>
                      </Step>
                    )}
                  </Stepper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDetailsDialog({ open: false, booking: null })}
            >
              Close
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
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default AdminPayments;
