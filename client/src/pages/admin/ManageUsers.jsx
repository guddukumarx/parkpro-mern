// src/pages/admin/ManageUsers.jsx
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
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Skeleton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "active" ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.getContrastText(
    status === "active" ? theme.palette.success.main : theme.palette.error.main,
  ),
  fontWeight: 600,
}));

const ManageUsers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Role change dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.status, filters.search, page, rowsPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        role: filters.role || undefined,
        isActive:
          filters.status === "active"
            ? true
            : filters.status === "inactive"
              ? false
              : undefined,
        search: filters.search || undefined,
        page: page + 1,
        limit: rowsPerPage,
      };
      const res = await adminService.getAllUsers(params);
      setUsers(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const handleClearFilters = () => {
    setFilters({ role: "", status: "", search: "" });
    setPage(0);
    fetchUsers();
  };

  const handleRoleChangeClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleChangeConfirm = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await adminService.updateUserRole(selectedUser._id, newRole);
      setSnackbar({
        open: true,
        message: "Role updated successfully",
        severity: "success",
      });
      setRoleDialogOpen(false);
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Update failed",
        severity: "error",
      });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId);
      setSnackbar({
        open: true,
        message: `User ${currentStatus ? "deactivated" : "activated"} successfully`,
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Toggle failed",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderUserCard = (user) => (
    <motion.div
      key={user._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Chip
              label={user.role}
              size="small"
              color="primary"
              variant="outlined"
            />
            <StyledChip
              label={user.isActive ? "Active" : "Inactive"}
              size="small"
              status={user.isActive ? "active" : "inactive"}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-around" }}>
          <Tooltip title="Change Role">
            <IconButton
              size="small"
              onClick={() => handleRoleChangeClick(user)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
            <IconButton
              size="small"
              color={user.isActive ? "error" : "success"}
              onClick={() => handleToggleStatus(user._id, user.isActive)}
            >
              {user.isActive ? (
                <BlockIcon fontSize="small" />
              ) : (
                <ActivateIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </motion.div>
  );

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
          Manage Users
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchUsers} disabled={loading} color="primary">
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name or email"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                label="Role"
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: "flex", gap: 1 }}>
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

      {/* Users Table / Cards */}
      {loading ? (
        isMobile ? (
          <Box>
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={100}
                sx={{ mb: 2, borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : (
          <Skeleton variant="rectangular" height={400} />
        )
      ) : users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Paper>
      ) : isMobile ? (
        <Box>
          <AnimatePresence>{users.map(renderUserCard)}</AnimatePresence>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <StyledChip
                      label={user.isActive ? "Active" : "Inactive"}
                      size="small"
                      status={user.isActive ? "active" : "inactive"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Change Role">
                      <IconButton
                        size="small"
                        onClick={() => handleRoleChangeClick(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                      <IconButton
                        size="small"
                        color={user.isActive ? "error" : "success"}
                        onClick={() =>
                          handleToggleStatus(user._id, user.isActive)
                        }
                      >
                        {user.isActive ? (
                          <BlockIcon fontSize="small" />
                        ) : (
                          <ActivateIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mt: 2 }}
        />
      )}

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            User: {selectedUser?.name} ({selectedUser?.email})
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Role</InputLabel>
            <Select
              value={newRole}
              label="New Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRoleChangeConfirm}>
            Save
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

export default ManageUsers;
