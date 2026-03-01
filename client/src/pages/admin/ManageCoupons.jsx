// src/pages/admin/ManageCoupons.jsx
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
  Button,
  IconButton,
  Chip,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Grid,
  Snackbar,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import adminService from "../../services/adminService";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const MotionBox = motion(Box);

const ManageCoupons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs to sm breakpoint
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minBookingAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    description: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    coupon: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCoupons();
  }, [page, rowsPerPage]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page: page + 1, limit: rowsPerPage };
      const res = await adminService.getAllCoupons(params);
      setCoupons(res.data || res);
      if (res.pagination) setTotal(res.pagination.total);
    } catch (err) {
      setError(err.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchCoupons();
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentCoupon(null);
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minBookingAmount: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      description: "",
      status: "active",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditMode(true);
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minBookingAmount: coupon.minBookingAmount || "",
      maxDiscount: coupon.maxDiscount || "",
      startDate: coupon.startDate.split("T")[0],
      endDate: coupon.endDate.split("T")[0],
      usageLimit: coupon.usageLimit || "",
      description: coupon.description || "",
      status: coupon.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.value) errors.value = "Value is required";
    else if (isNaN(formData.value) || Number(formData.value) <= 0)
      errors.value = "Value must be positive";
    if (formData.type === "percentage" && Number(formData.value) > 100)
      errors.value = "Percentage cannot exceed 100";
    if (!formData.startDate) errors.startDate = "Start date required";
    if (!formData.endDate) errors.endDate = "End date required";
    else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
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
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        minBookingAmount: formData.minBookingAmount
          ? parseFloat(formData.minBookingAmount)
          : 0,
        maxDiscount: formData.maxDiscount
          ? parseFloat(formData.maxDiscount)
          : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      };

      if (editMode) {
        await adminService.updateCoupon(currentCoupon._id, payload);
        setSnackbar({
          open: true,
          message: "Coupon updated",
          severity: "success",
        });
      } else {
        await adminService.createCoupon(payload);
        setSnackbar({
          open: true,
          message: "Coupon created",
          severity: "success",
        });
      }
      handleCloseModal();
      fetchCoupons();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (coupon) => {
    setDeleteDialog({ open: true, coupon });
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteCoupon(deleteDialog.coupon._id);
      setSnackbar({
        open: true,
        message: "Coupon deleted",
        severity: "success",
      });
      setDeleteDialog({ open: false, coupon: null });
      fetchCoupons();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Delete failed",
        severity: "error",
      });
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Mobile card view for coupons
  const renderMobileCards = () => (
    <Grid container spacing={2}>
      {filteredCoupons.map((c) => (
        <Grid item xs={12} key={c._id}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">{c.code}</Typography>
                <Chip
                  label={c.status}
                  color={c.status === "active" ? "success" : "default"}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Type: {c.type} | Value:{" "}
                {c.type === "percentage" ? `${c.value}%` : `$${c.value}`}
              </Typography>
              <Typography variant="body2">
                Min Booking: ${c.minBookingAmount}
              </Typography>
              <Typography variant="body2">
                Valid: {new Date(c.startDate).toLocaleDateString()} -{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Used: {c.usedCount}
                {c.usageLimit ? ` / ${c.usageLimit}` : ""}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <IconButton size="small" onClick={() => handleOpenEdit(c)}>
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(c)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MotionBox
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
            Manage Coupons
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            fullWidth={isMobile}
          >
            Add Coupon
          </Button>
        </Box>

        {/* Search Bar */}
        <StyledPaper sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search by coupon code"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 200 }}
              fullWidth={isMobile}
            />
            <Button
              variant="outlined"
              onClick={handleSearch}
              fullWidth={isMobile}
            >
              Search
            </Button>
          </Box>
        </StyledPaper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : filteredCoupons.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography>No coupons found</Typography>
          </Paper>
        ) : (
          <>
            {isMobile ? (
              renderMobileCards()
            ) : (
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table size={isTablet ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Min Booking</TableCell>
                      <TableCell>Valid From</TableCell>
                      <TableCell>Valid To</TableCell>
                      <TableCell>Usage</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCoupons.map((c) => (
                      <TableRow key={c._id} hover>
                        <TableCell>
                          <strong>{c.code}</strong>
                        </TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell>
                          {c.type === "percentage"
                            ? `${c.value}%`
                            : `$${c.value}`}
                        </TableCell>
                        <TableCell>${c.minBookingAmount}</TableCell>
                        <TableCell>
                          {new Date(c.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(c.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {c.usedCount}
                          {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={c.status}
                            color={
                              c.status === "active" ? "success" : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(c)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(c)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
      </MotionBox>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>{editMode ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                error={!!formErrors.code}
                helperText={formErrors.code}
                required
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={
                  formData.type === "percentage"
                    ? "Percentage (%)"
                    : "Amount ($)"
                }
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                error={!!formErrors.value}
                helperText={formErrors.value}
                required
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: formData.type === "percentage" ? 1 : 0.01,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Min Booking Amount ($)"
                name="minBookingAmount"
                type="number"
                value={formData.minBookingAmount}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            {formData.type === "percentage" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Discount ($) (optional)"
                  name="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit (leave empty for unlimited)"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={!!formErrors.endDate}
                helperText={formErrors.endDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? "active" : "inactive",
                      })
                    }
                  />
                }
                label="Active"
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
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, coupon: null })}
      >
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.coupon?.code}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, coupon: null })}
          >
            Cancel
          </Button>
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

export default ManageCoupons;
