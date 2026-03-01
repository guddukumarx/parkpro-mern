// src/pages/admin/AuditLogs.jsx
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
  TablePagination,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Skeleton,
  Alert,
  Grid,
  IconButton,
  Collapse,
  useMediaQuery,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const AuditLogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(!isMobile); // show filters on desktop by default

  // Filters
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    from: "",
    to: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchLogs();
  }, [
    filters.action,
    filters.entity,
    filters.from,
    filters.to,
    filters.page,
    filters.limit,
  ]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        action: filters.action || undefined,
        entity: filters.entity || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        page: filters.page,
        limit: filters.limit,
      };
      const res = await adminService.getAuditLogs(params);
      setLogs(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleChangePage = (event, newPage) => {
    setFilters({ ...filters, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    setFilters({
      ...filters,
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "info";
      case "DELETE":
        return "error";
      case "APPROVE":
        return "primary";
      case "REJECT":
        return "warning";
      default:
        return "default";
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
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
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Audit Logs
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchLogs} disabled={loading} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle filters">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color="primary"
            >
              {showFilters ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filter Section */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  name="action"
                  value={filters.action}
                  label="Action"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="CREATE">Create</MenuItem>
                  <MenuItem value="UPDATE">Update</MenuItem>
                  <MenuItem value="DELETE">Delete</MenuItem>
                  <MenuItem value="APPROVE">Approve</MenuItem>
                  <MenuItem value="REJECT">Reject</MenuItem>
                  <MenuItem value="ROLE_CHANGE">Role Change</MenuItem>
                  <MenuItem value="STATUS_CHANGE">Status Change</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Entity</InputLabel>
                <Select
                  name="entity"
                  value={filters.entity}
                  label="Entity"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Parking">Parking</MenuItem>
                  <MenuItem value="Slot">Slot</MenuItem>
                  <MenuItem value="Booking">Booking</MenuItem>
                  <MenuItem value="Coupon">Coupon</MenuItem>
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="EmailTemplate">Email Template</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <Box sx={{ width: "100%" }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={60}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      )}

      {/* No data */}
      {!loading && logs.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No audit logs found.</Typography>
        </Paper>
      )}

      {/* Desktop Table View */}
      {!loading && logs.length > 0 && !isMobile && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.tr
                      key={log._id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.03 }}
                      style={{ display: "table-row" }}
                    >
                      <TableCell>{formatDate(log.createdAt)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {log.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.user?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          color={getActionColor(log.action)}
                        />
                      </TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell>
                        {log.details ||
                          (log.changes ? JSON.stringify(log.changes) : "—")}
                      </TableCell>
                      <TableCell>{log.ip || "—"}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Mobile Card View */}
      {!loading && logs.length > 0 && isMobile && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {logs.map((log, index) => (
            <motion.div
              key={log._id}
              variants={itemVariants}
              transition={{ delay: index * 0.03 }}
            >
              <StyledCard>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {log.user?.name}
                    </Typography>
                    <Chip
                      label={log.action}
                      size="small"
                      color={getActionColor(log.action)}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {formatDate(log.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Entity:</strong> {log.entity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Details:</strong>{" "}
                    {log.details || (log.changes ? "Changes recorded" : "—")}
                  </Typography>
                  {log.ip && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                      color="text.secondary"
                    >
                      IP: {log.ip}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={filters.limit}
          page={filters.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Container>
  );
};

export default AuditLogs;
