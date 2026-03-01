// src/pages/admin/AdminPayouts.jsx
import React, { useState, useEffect, useMemo } from "react";
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Skeleton,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  GetApp as ExportIcon,
  Info as InfoIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays } from "date-fns";
import adminService from "../../services/adminService";

// Styled components
const StyledCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: theme.palette.warning.main,
    processing: theme.palette.info.main,
    completed: theme.palette.success.main,
    rejected: theme.palette.error.main,
  };
  const bgColor = colors[status] || theme.palette.grey[500];
  return {
    backgroundColor: bgColor,
    color: theme.palette.getContrastText(bgColor),
    fontWeight: 600,
  };
});

const SummaryCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(2),
  background: bgcolor,
  color: "#fff",
  borderRadius: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 80,
  fontSize: "0.75rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "0.875rem",
    minWidth: 100,
  },
}));

const AdminPayouts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
    totalRejected: 0,
    totalAmount: 0,
  });

  // Modal state for processing
  const [processModal, setProcessModal] = useState({
    open: false,
    payout: null,
    transactionId: "",
    notes: "",
    action: "processing", // or "completed", "rejected"
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPayouts();
  }, [page, rowsPerPage, filters.status, filters.dateFrom, filters.dateTo, orderBy, order]);

  const fetchPayouts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        status: filters.status || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
      };
      const res = await adminService.getPayouts(params);
      setPayouts(res.data || res);
      if (res.pagination) setTotal(res.pagination.total);
      computeSummary(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  const computeSummary = (data) => {
    const summary = {
      totalPending: 0,
      totalProcessing: 0,
      totalCompleted: 0,
      totalRejected: 0,
      totalAmount: 0,
    };
    data.forEach((p) => {
      summary.totalAmount += p.amount || 0;
      switch (p.status) {
        case "pending":
          summary.totalPending += p.amount;
          break;
        case "processing":
          summary.totalProcessing += p.amount;
          break;
        case "completed":
          summary.totalCompleted += p.amount;
          break;
        case "rejected":
          summary.totalRejected += p.amount;
          break;
        default:
          break;
      }
    });
    setSummary(summary);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = () => {
    setPage(0);
    fetchPayouts();
  };

  const handleProcessClick = (payout, action) => {
    setProcessModal({
      open: true,
      payout,
      transactionId: payout.transactionId || "",
      notes: payout.notes || "",
      action,
    });
  };

  const handleProcessConfirm = async () => {
    const { payout, transactionId, notes, action } = processModal;
    try {
      await adminService.updatePayoutStatus(payout._id, action, {
        transactionId,
        notes,
      });
      setSnackbar({
        open: true,
        message: `Payout ${action}`,
        severity: "success",
      });
      setProcessModal({ ...processModal, open: false });
      fetchPayouts();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Update failed",
        severity: "error",
      });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminService.exportData("payouts", "csv");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payouts_${format(new Date(), "yyyyMMdd")}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setSnackbar({ open: true, message: "Export failed", severity: "error" });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter by search (client‑side, but ideally server‑side)
  const filteredPayouts = useMemo(() => {
    if (!filters.search) return payouts;
    return payouts.filter((p) =>
      p.owner?.name?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [payouts, filters.search]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Helper to display account details nicely
  const renderAccountDetails = (details) => {
    if (!details || typeof details !== "object") return details;
    return Object.entries(details)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
  };

  // Mobile/Tablet card view
  const renderMobileCards = () => (
    <Grid container spacing={2}>
      <AnimatePresence>
        {filteredPayouts.map((payout) => (
          <Grid item xs={12} key={payout._id}>
            <StyledCard
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {payout.owner?.name || "Unknown"}
                  </Typography>
                  <StatusChip label={payout.status} size="small" status={payout.status} />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Amount: <strong>${payout.amount?.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Method: {payout.paymentMethod}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(payout.createdAt).toLocaleDateString()}
                </Typography>
                {payout.accountDetails && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, wordBreak: "break-word" }}>
                    Account: {renderAccountDetails(payout.accountDetails)}
                  </Typography>
                )}
                {payout.transactionId && (
                  <Typography variant="caption" display="block" color="primary">
                    TXN: {payout.transactionId}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", gap: 1, p: 2 }}>
                {payout.status === "pending" && (
                  <>
                    <ActionButton
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleProcessClick(payout, "processing")}
                    >
                      Process
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<RejectIcon />}
                      onClick={() => handleProcessClick(payout, "rejected")}
                    >
                      Reject
                    </ActionButton>
                  </>
                )}
                {payout.status === "processing" && (
                  <>
                    <ActionButton
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleProcessClick(payout, "completed")}
                    >
                      Complete
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<RejectIcon />}
                      onClick={() => handleProcessClick(payout, "rejected")}
                    >
                      Reject
                    </ActionButton>
                  </>
                )}
                {payout.status === "completed" && (
                  <Typography variant="caption" color="success.main">
                    Completed
                  </Typography>
                )}
                {payout.status === "rejected" && (
                  <Typography variant="caption" color="error.main">
                    Rejected
                  </Typography>
                )}
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );

  // Desktop table view
  const renderDesktopTable = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "owner.name" ? order : false}>
              <TableSortLabel
                active={orderBy === "owner.name"}
                direction={orderBy === "owner.name" ? order : "asc"}
                onClick={() => handleRequestSort("owner.name")}
              >
                Owner
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === "amount" ? order : false}>
              <TableSortLabel
                active={orderBy === "amount"}
                direction={orderBy === "amount" ? order : "asc"}
                onClick={() => handleRequestSort("amount")}
              >
                Amount ($)
              </TableSortLabel>
            </TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Account Details</TableCell>
            <TableCell sortDirection={orderBy === "status" ? order : false}>
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={() => handleRequestSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "createdAt" ? order : false}>
              <TableSortLabel
                active={orderBy === "createdAt"}
                direction={orderBy === "createdAt" ? order : "asc"}
                onClick={() => handleRequestSort("createdAt")}
              >
                Requested
              </TableSortLabel>
            </TableCell>
            <TableCell>Transaction ID</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPayouts.map((payout) => (
            <TableRow key={payout._id} hover>
              <TableCell>{payout.owner?.name}</TableCell>
              <TableCell align="right">${payout.amount?.toFixed(2)}</TableCell>
              <TableCell>{payout.paymentMethod}</TableCell>
              <TableCell sx={{ maxWidth: 200, wordBreak: "break-word" }}>
                {renderAccountDetails(payout.accountDetails)}
              </TableCell>
              <TableCell>
                <StatusChip label={payout.status} size="small" status={payout.status} />
              </TableCell>
              <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Tooltip title={payout.transactionId || "N/A"}>
                  <span>{payout.transactionId ? payout.transactionId.slice(-8) : "—"}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                {payout.status === "pending" && (
                  <>
                    <Tooltip title="Process">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleProcessClick(payout, "processing")}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleProcessClick(payout, "rejected")}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {payout.status === "processing" && (
                  <>
                    <Tooltip title="Complete">
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleProcessClick(payout, "completed")}
                      >
                        <ApproveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleProcessClick(payout, "rejected")}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => handleProcessClick(payout, "view")}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Payout Requests
        </Typography>
        <Box>
          <Tooltip title="Export CSV">
            <IconButton onClick={handleExport} color="primary" sx={{ mr: 1 }}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={fetchPayouts} disabled={loading} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Pending", value: summary.totalPending, color: theme.palette.warning.main },
          { label: "Processing", value: summary.totalProcessing, color: theme.palette.info.main },
          { label: "Completed", value: summary.totalCompleted, color: theme.palette.success.main },
          { label: "Rejected", value: summary.totalRejected, color: theme.palette.error.main },
        ].map((item, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <SummaryCard bgcolor={item.color}>
              <Typography variant="h6">${item.value.toFixed(2)}</Typography>
              <Typography variant="body2">{item.label}</Typography>
            </SummaryCard>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by owner name"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" onClick={handleSearch} fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error & Content */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredPayouts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <PaymentIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No payout requests found
          </Typography>
        </Paper>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {isMobile || isTablet ? renderMobileCards() : renderDesktopTable()}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && filteredPayouts.length > 0 && (
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
      )}

      {/* Process/View Modal */}
      <Dialog
        open={processModal.open}
        onClose={() => setProcessModal({ ...processModal, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {processModal.action === "view"
            ? "Payout Details"
            : processModal.action === "processing"
            ? "Process Payout"
            : processModal.action === "completed"
            ? "Complete Payout"
            : processModal.action === "rejected"
            ? "Reject Payout"
            : "Payout Action"}
        </DialogTitle>
        <DialogContent dividers>
          {processModal.payout && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Owner
                </Typography>
                <Typography variant="body1">{processModal.payout.owner?.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body1">${processModal.payout.amount?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">{processModal.payout.paymentMethod}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <StatusChip label={processModal.payout.status} size="small" status={processModal.payout.status} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Details
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {renderAccountDetails(processModal.payout.accountDetails)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {processModal.action !== "view" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      value={processModal.transactionId}
                      onChange={(e) =>
                        setProcessModal({ ...processModal, transactionId: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      value={processModal.notes}
                      onChange={(e) => setProcessModal({ ...processModal, notes: e.target.value })}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessModal({ ...processModal, open: false })}>Cancel</Button>
          {processModal.action !== "view" && (
            <Button
              variant="contained"
              color={processModal.action === "rejected" ? "error" : "primary"}
              onClick={handleProcessConfirm}
            >
              {processModal.action === "processing"
                ? "Mark as Processing"
                : processModal.action === "completed"
                ? "Mark as Completed"
                : processModal.action === "rejected"
                ? "Reject Payout"
                : "Submit"}
            </Button>
          )}
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

export default AdminPayouts;