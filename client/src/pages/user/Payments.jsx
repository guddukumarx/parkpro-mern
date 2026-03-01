// src/pages/user/Payments.jsx
import React, { useState, useEffect } from 'react';
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
  Chip,
  Skeleton,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

const PaymentsPage = () => {
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.parkingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.paymentStatus === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt).toISOString().split('T')[0];
        return paymentDate === dateFilter;
      });
    }

    setFilteredPayments(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, dateFilter, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await bookingService.fetchUserBookings({ limit: 1000 }); // get all user bookings
      const bookings = res.data || res;

      // Transform bookings into payment records
      const paymentList = bookings.map(b => ({
        id: b._id,
        bookingId: b._id,
        parkingName: b.parking?.name || 'Unknown',
        slotNumber: b.slot?.slotNumber,
        amount: b.totalPrice,
        date: b.createdAt,
        paymentStatus: b.paymentStatus || 'pending',
        bookingStatus: b.status,
        method: b.paymentMethod || 'Credit Card', // placeholder
      }));

      setPayments(paymentList);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case 'paid': color = 'success'; break;
      case 'pending': color = 'warning'; break;
      case 'refunded': color = 'info'; break;
      default: color = 'default';
    }
    return <Chip label={status} color={color} size="small" />;
  };

  const handleDownloadReceipt = (paymentId) => {
    // Placeholder for receipt download
    alert(`Download receipt for payment ${paymentId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Payments</Typography>
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Payment History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by parking or booking ID"
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
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Parking</TableCell>
              <TableCell align="right">Amount ($)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Method</TableCell>
              <TableCell align="center">Receipt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {payment.bookingId.slice(-8)}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.parkingName} (Slot {payment.slotNumber})</TableCell>
                    <TableCell align="right">${payment.amount?.toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(payment.paymentStatus)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Download Receipt">
                        <IconButton size="small" onClick={() => handleDownloadReceipt(payment.id)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default PaymentsPage;