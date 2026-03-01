// src/pages/owner/OwnerPayouts.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Alert,
  Snackbar,
  Skeleton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  AccountBalance as BalanceIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const FormCard = styled(motion(Card))(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
}));

const HistoryCard = styled(motion(Card))(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: "relative",
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: theme.palette.warning.main,
    processing: theme.palette.info.main,
    completed: theme.palette.success.main,
    rejected: theme.palette.error.main,
  };
  return {
    backgroundColor: colors[status] || theme.palette.grey[500],
    color: "#fff",
    fontWeight: 600,
  };
});

const BalanceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "#fff",
  borderRadius: theme.spacing(2),
}));

const OwnerPayouts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  // State
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    accountDetails: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pagination & filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Detail modal
  const [detailModal, setDetailModal] = useState({ open: false, payout: null });

  // Cancel dialog
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    payout: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch earnings balance (optional endpoint)
  const fetchBalance = async () => {
    if (!ownerService.getEarnings) return;
    setBalanceLoading(true);
    try {
      const res = await ownerService.getEarnings();
      setBalance(res.data?.availableBalance || 0);
    } catch (err) {
      console.error("Balance fetch failed", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch payouts with filters
  const fetchPayouts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: statusFilter || undefined,
        page: page + 1,
        limit: rowsPerPage,
      };
      const res = await ownerService.getPayouts(params);
      setPayouts(res.data || res);
      if (res.pagination) {
        setTotal(res.pagination.total);
      } else {
        setTotal((res.data || res).length);
      }
    } catch (err) {
      setError(err.message || "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
    fetchBalance();
  }, [page, rowsPerPage, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.amount) errors.amount = "Amount is required";
    else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    } else if (balance !== null && Number(formData.amount) > balance) {
      errors.amount = `Amount exceeds available balance ($${balance.toFixed(2)})`;
    }
    if (!formData.accountDetails.trim()) {
      errors.accountDetails = "Account details are required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      await ownerService.requestPayout({
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        accountDetails: formData.accountDetails,
      });
      setSnackbar({
        open: true,
        message: "Payout requested successfully",
        severity: "success",
      });
      setFormData({
        amount: "",
        paymentMethod: "bank_transfer",
        accountDetails: "",
      });
      fetchPayouts();
      fetchBalance(); // refresh balance
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Request failed",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelDialog.payout) return;
    try {
      await ownerService.cancelPayout(cancelDialog.payout._id);
      setSnackbar({
        open: true,
        message: "Payout cancelled",
        severity: "success",
      });
      fetchPayouts();
      fetchBalance();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Cancel failed",
        severity: "error",
      });
    } finally {
      setCancelDialog({ open: false, payout: null });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    return <StatusChip label={status} size="small" status={status} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={variants}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Payouts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Request withdrawals and track your payment history.
          </Typography>
        </motion.div>
        <Tooltip title="Refresh">
          <IconButton
            onClick={() => {
              fetchPayouts();
              fetchBalance();
            }}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Balance Card (if supported) */}
      {balance !== null && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <BalanceCard sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BalanceIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Available Balance
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  ${balance.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            {balanceLoading && <Skeleton width={80} height={40} />}
          </BalanceCard>
        </motion.div>
      )}

      <Grid container spacing={4}>
        {/* Request Form */}
        <Grid item xs={12} md={4}>
          <FormCard
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ delay: 0.2 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Request Withdrawal</Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Amount ($)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                  margin="normal"
                  required
                  InputProps={{
                    inputProps: { min: 1, step: 0.01 },
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  margin="normal"
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Account Details"
                  name="accountDetails"
                  multiline
                  rows={3}
                  value={formData.accountDetails}
                  onChange={handleChange}
                  error={!!formErrors.accountDetails}
                  helperText={formErrors.accountDetails}
                  margin="normal"
                  required
                  placeholder="Bank account / PayPal email / Stripe account"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={submitting}
                  sx={{ mt: 2 }}
                >
                  {submitting ? "Requesting..." : "Request Payout"}
                </Button>
              </form>
            </CardContent>
          </FormCard>
        </Grid>

        {/* Payout History */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Payout History</Typography>
              </Box>
              <Tooltip title="Filter by status">
                <IconButton onClick={() => setFilterOpen(!filterOpen)}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Filter dropdown */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginBottom: 16 }}
                >
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
              )}
            </AnimatePresence>

            <Divider sx={{ mb: 2 }} />

            {loading ? (
              // Skeleton loaders
              <Box>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={60}
                    sx={{ mb: 1, borderRadius: 1 }}
                  />
                ))}
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : payouts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <MoneyIcon
                  sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }}
                />
                <Typography color="text.secondary">
                  No payout requests yet.
                </Typography>
              </Box>
            ) : (
              <>
                <AnimatePresence>
                  {isMobile ? (
                    // Mobile card view
                    <Box>
                      {payouts.map((p, index) => (
                        <HistoryCard
                          key={p._id}
                          initial="hidden"
                          animate="visible"
                          variants={variants}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Amount
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                ${p.amount.toFixed(2)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Status
                              </Typography>
                              <Box>{getStatusChip(p.status)}</Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Method
                              </Typography>
                              <Typography variant="body2">
                                {p.paymentMethod}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Requested
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(p.createdAt)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setDetailModal({ open: true, payout: p })
                                }
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {p.status === "pending" && (
                              <Tooltip title="Cancel Request">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    setCancelDialog({ open: true, payout: p })
                                  }
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </HistoryCard>
                      ))}
                    </Box>
                  ) : (
                    // Desktop table view
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date Requested</TableCell>
                            <TableCell align="right">Amount ($)</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Account Details</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payouts.map((p, index) => (
                            <motion.tr
                              key={p._id}
                              initial="hidden"
                              animate="visible"
                              variants={variants}
                              transition={{ delay: index * 0.05 }}
                              style={{ display: "table-row" }}
                            >
                              <TableCell>{formatDate(p.createdAt)}</TableCell>
                              <TableCell align="right">
                                ${p.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{p.paymentMethod}</TableCell>
                              <TableCell
                                sx={{ maxWidth: 200, wordBreak: "break-word" }}
                              >
                                {p.accountDetails}
                              </TableCell>
                              <TableCell>{getStatusChip(p.status)}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setDetailModal({ open: true, payout: p })
                                    }
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                </Tooltip>
                                {p.status === "pending" && (
                                  <Tooltip title="Cancel Request">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        setCancelDialog({
                                          open: true,
                                          payout: p,
                                        })
                                      }
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Detail Modal */}
      <Dialog
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, payout: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payout Details</DialogTitle>
        <DialogContent dividers>
          {detailModal.payout && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body1">
                  ${detailModal.payout.amount.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                {getStatusChip(detailModal.payout.status)}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {detailModal.payout.paymentMethod}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Requested
                </Typography>
                <Typography variant="body1">
                  {formatDate(detailModal.payout.createdAt)}
                </Typography>
              </Grid>
              {detailModal.payout.processedAt && (
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Processed
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(detailModal.payout.processedAt)}
                  </Typography>
                </Grid>
              )}
              {detailModal.payout.transactionId && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2">
                    {detailModal.payout.transactionId}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Details
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {detailModal.payout.accountDetails}
                </Typography>
              </Grid>
              {detailModal.payout.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Admin Notes
                  </Typography>
                  <Typography variant="body2">
                    {detailModal.payout.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModal({ open: false, payout: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, payout: null })}
      >
        <DialogTitle>Cancel Payout Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this payout request? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialog({ open: false, payout: null })}
          >
            No, Keep
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerPayouts;
