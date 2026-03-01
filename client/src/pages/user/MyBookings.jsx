// // src/components/user/MyBookings.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   TextField,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip,
//   Pagination,
//   Skeleton,
//   Paper,
//   IconButton,
//   Tooltip,
//   Divider,
//   Alert,
//   useTheme,
//   InputAdornment,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import EventIcon from '@mui/icons-material/Event';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import CancelIcon from '@mui/icons-material/Cancel';
// import DownloadIcon from '@mui/icons-material/Download';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ClearIcon from '@mui/icons-material/Clear';

// // Custom styled components
// const PageHeader = styled(Box)(({ theme }) => ({
//   marginBottom: theme.spacing(4),
// }));

// const FilterBar = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   padding: theme.spacing(2),
//   marginBottom: theme.spacing(4),
//   display: 'flex',
//   flexWrap: 'wrap',
//   gap: theme.spacing(2),
//   alignItems: 'center',
//   borderRadius: theme.shape.borderRadius,
// }));

// const BookingCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   transition: 'transform 0.2s, box-shadow 0.2s',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: theme.shadows[4],
//   },
// }));

// const StatusChip = styled(Chip)(({ theme, status }) => {
//   let color;
//   switch (status) {
//     case 'active':
//       color = theme.palette.success.main;
//       break;
//     case 'completed':
//       color = theme.palette.info.main;
//       break;
//     case 'cancelled':
//       color = theme.palette.error.main;
//       break;
//     default:
//       color = theme.palette.grey[500];
//   }
//   return {
//     backgroundColor: color,
//     color: theme.palette.getContrastText(color),
//     fontWeight: 600,
//   };
// });

// const IconText = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(1),
//   marginBottom: theme.spacing(0.5),
// }));

// const MyBookings = () => {
//   const theme = useTheme();

//   // State for filters
//   const [search, setSearch] = useState('');
//   const [dateFilter, setDateFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // State for bookings data, loading, pagination
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState(null);

//   // Simulate fetching data (mock)
//   useEffect(() => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       const mockBookings = [
//         {
//           id: 'BK-1001',
//           parkingName: 'Downtown Garage',
//           location: '123 Main St, Downtown',
//           date: '2026-02-15',
//           startTime: '14:30',
//           endTime: '17:30',
//           duration: '3 hours',
//           amount: 12.00,
//           status: 'active',
//         },
//         {
//           id: 'BK-1002',
//           parkingName: 'City Center Parking',
//           location: '456 Market St, City Center',
//           date: '2026-02-14',
//           startTime: '10:00',
//           endTime: '12:00',
//           duration: '2 hours',
//           amount: 8.50,
//           status: 'completed',
//         },
//         {
//           id: 'BK-1003',
//           parkingName: 'North Station Lot',
//           location: '789 Station Rd, North',
//           date: '2026-02-13',
//           startTime: '09:00',
//           endTime: '14:00',
//           duration: '5 hours',
//           amount: 20.00,
//           status: 'completed',
//         },
//         {
//           id: 'BK-1004',
//           parkingName: 'South Mall Parking',
//           location: '321 Mall Ave, South',
//           date: '2026-02-12',
//           startTime: '16:00',
//           endTime: '18:00',
//           duration: '2 hours',
//           amount: 7.50,
//           status: 'cancelled',
//         },
//         {
//           id: 'BK-1005',
//           parkingName: 'Airport Parking',
//           location: '500 Airport Blvd',
//           date: '2026-02-16',
//           startTime: '08:00',
//           endTime: '20:00',
//           duration: '12 hours',
//           amount: 36.00,
//           status: 'active',
//         },
//       ];
//       // Apply filters (mock filtering)
//       let filtered = mockBookings;
//       if (search) {
//         filtered = filtered.filter(b =>
//           b.parkingName.toLowerCase().includes(search.toLowerCase()) ||
//           b.location.toLowerCase().includes(search.toLowerCase())
//         );
//       }
//       if (dateFilter) {
//         filtered = filtered.filter(b => b.date === dateFilter);
//       }
//       if (statusFilter !== 'all') {
//         filtered = filtered.filter(b => b.status === statusFilter);
//       }
//       setBookings(filtered);
//       setTotalPages(Math.ceil(filtered.length / 6)); // 6 per page
//       setLoading(false);
//     }, 1000);
//   }, [search, dateFilter, statusFilter]);

//   // Handle page change
//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   // Handle cancel booking
//   const handleCancel = (bookingId) => {
//     // In real app, call API to cancel
//     alert(`Cancel booking ${bookingId}`);
//     // Then refresh data or update local state
//   };

//   // Handle view details
//   const handleViewDetails = (bookingId) => {
//     alert(`View details for ${bookingId}`);
//   };

//   // Handle download invoice
//   const handleDownloadInvoice = (bookingId) => {
//     alert(`Download invoice for ${bookingId}`);
//   };

//   // Clear filters
//   const clearFilters = () => {
//     setSearch('');
//     setDateFilter('');
//     setStatusFilter('all');
//   };

//   // Paginate bookings
//   const bookingsPerPage = 6;
//   const displayedBookings = bookings.slice((page-1)*bookingsPerPage, page*bookingsPerPage);

//   return (
//     <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
//       <Container maxWidth="lg">
//         {/* Page Header */}
//         <PageHeader>
//           <Typography variant="h4" component="h1" color="text.primary" fontWeight={700}>
//             My Bookings
//           </Typography>
//           <Typography variant="body1" color="text.primary" sx={{ opacity: 0.8, mt: 1 }}>
//             View and manage all your parking reservations
//           </Typography>
//         </PageHeader>

//         {/* Filter Bar */}
//         <FilterBar elevation={1}>
//           <TextField
//             placeholder="Search by parking name or location"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             variant="outlined"
//             size="small"
//             sx={{ flex: 1, minWidth: 200 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             label="Date"
//             type="date"
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//             size="small"
//             InputLabelProps={{ shrink: true }}
//             sx={{ width: 140 }}
//           />
//           <FormControl size="small" sx={{ width: 140 }}>
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={statusFilter}
//               label="Status"
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="completed">Completed</MenuItem>
//               <MenuItem value="cancelled">Cancelled</MenuItem>
//             </Select>
//           </FormControl>
//           <Tooltip title="Clear filters">
//             <IconButton onClick={clearFilters} size="small">
//               <ClearIcon />
//             </IconButton>
//           </Tooltip>
//         </FilterBar>

//         {/* Bookings Grid */}
//         {loading ? (
//           <Grid container spacing={3}>
//             {[...Array(6)].map((_, idx) => (
//               <Grid item xs={12} sm={6} md={4} key={idx}>
//                 <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//               </Grid>
//             ))}
//           </Grid>
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : bookings.length === 0 ? (
//           <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No bookings found
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Try adjusting your filters or book a parking slot now.
//             </Typography>
//             <Button variant="contained" color="primary" sx={{ mt: 2, color: 'text.primary' }}>
//               Book a Slot
//             </Button>
//           </Paper>
//         ) : (
//           <>
//             <Grid container spacing={3}>
//               {displayedBookings.map((booking) => (
//                 <Grid item xs={12} sm={6} md={4} key={booking.id}>
//                   <BookingCard>
//                     <CardContent sx={{ flexGrow: 1 }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//                         <Typography variant="h6" color="text.secondary" fontWeight={600} noWrap sx={{ maxWidth: '70%' }}>
//                           {booking.parkingName}
//                         </Typography>
//                         <StatusChip label={booking.status.toUpperCase()} size="small" status={booking.status} />
//                       </Box>
//                       <IconText>
//                         <LocationOnIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
//                         <Typography variant="body2" color="text.secondary" noWrap>
//                           {booking.location}
//                         </Typography>
//                       </IconText>
//                       <IconText>
//                         <EventIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
//                         <Typography variant="body2" color="text.secondary">
//                           {booking.date} | {booking.startTime} - {booking.endTime}
//                         </Typography>
//                       </IconText>
//                       <IconText>
//                         <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
//                         <Typography variant="body2" color="text.secondary">
//                           {booking.duration}
//                         </Typography>
//                       </IconText>
//                       <IconText>
//                         <AttachMoneyIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
//                         <Typography variant="body2" color="text.secondary">
//                           ${booking.amount.toFixed(2)}
//                         </Typography>
//                       </IconText>
//                     </CardContent>
//                     <Divider />
//                     <CardActions sx={{ justifyContent: 'space-around', p: 1 }}>
//                       <Tooltip title="View Details">
//                         <IconButton size="small" onClick={() => handleViewDetails(booking.id)}>
//                           <VisibilityIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       {booking.status === 'active' && (
//                         <Tooltip title="Cancel Booking">
//                           <IconButton size="small" onClick={() => handleCancel(booking.id)} color="error">
//                             <CancelIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                       <Tooltip title="Download Invoice">
//                         <IconButton size="small" onClick={() => handleDownloadInvoice(booking.id)}>
//                           <DownloadIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </CardActions>
//                   </BookingCard>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                 <Pagination
//                   count={totalPages}
//                   page={page}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size="large"
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default MyBookings;

// src/pages/user/MyBookings.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Cancel as CancelIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import bookingService from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    booking: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchBookings();
  }, [filters.status, filters.page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status !== "all" ? filters.status : undefined,
        page: filters.page,
        limit: filters.limit,
      };
      const response = await bookingService.fetchUserBookings(null, params);
      // Assuming response has data and pagination
      setBookings(response.data || response);
      if (response.pagination) setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingService.cancelBooking(cancelDialog.booking._id);
      setSnackbar({
        open: true,
        message: "Booking cancelled",
        severity: "success",
      });
      setCancelDialog({ open: false, booking: null });
      fetchBookings(); // refresh
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Cancel failed",
        severity: "error",
      });
      setCancelDialog({ open: false, booking: null });
    }
  };

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case "confirmed":
        color = "info";
        break;
      case "active":
        color = "success";
        break;
      case "completed":
        color = "default";
        break;
      case "cancelled":
        color = "error";
        break;
      default:
        color = "warning";
    }
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        My Bookings
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parking</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.parking?.name}</TableCell>
                  <TableCell>{b.slot?.slotNumber}</TableCell>
                  <TableCell>
                    {new Date(b.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(b.endTime).toLocaleString()}</TableCell>
                  <TableCell>${b.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(b.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/user/bookings/${b._id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                    {["confirmed", "active"].includes(b.status) && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setCancelDialog({ open: true, booking: b })
                        }
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={filters.page}
            onChange={(e, val) => setFilters({ ...filters, page: val })}
          />
        </Box>
      )}

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, booking: null })}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel booking for slot{" "}
          {cancelDialog.booking?.slot?.slotNumber}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialog({ open: false, booking: null })}
          >
            No
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Yes, Cancel
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

export default MyBookings;
