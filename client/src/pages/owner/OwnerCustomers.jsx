// src/pages/owner/OwnerCustomers.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Pagination,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

// Styled components
const CustomerCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const CustomersPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : isTablet ? 6 : 8;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
    setFilteredCustomers(filtered);
    setPage(1);
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Fetch all owner bookings (limit high to capture all customers)
      const res = await bookingService.fetchOwnerBookings({ limit: 1000 });
      const bookings = res.data || res;

      // Aggregate by user
      const userMap = new Map();
      bookings.forEach(b => {
        if (!b.user) return;
        const userId = b.user._id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            _id: userId,
            name: b.user.name,
            email: b.user.email,
            phone: b.user.phone || '',
            totalBookings: 0,
            totalSpent: 0,
            lastBooking: null,
          });
        }
        const cust = userMap.get(userId);
        cust.totalBookings += 1;
        cust.totalSpent += b.totalPrice || 0;
        const bookingDate = new Date(b.createdAt);
        if (!cust.lastBooking || bookingDate > new Date(cust.lastBooking)) {
          cust.lastBooking = b.createdAt;
        }
      });

      const customersList = Array.from(userMap.values());
      // Sort by most recent lastBooking
      customersList.sort((a, b) => new Date(b.lastBooking) - new Date(a.lastBooking));
      setCustomers(customersList);
      setFilteredCustomers(customersList);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Customers</Typography>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
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
        Customers
      </Typography>

      {/* Search Bar */}
      <SearchBar elevation={1}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </SearchBar>

      {/* Stats Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Total Customers: {filteredCustomers.length}
        </Typography>
      </Box>

      {/* Customer Grid */}
      <Grid container spacing={3}>
        {paginatedCustomers.map((customer, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={customer._id}>
            <CustomerCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={customer.avatar}
                    sx={{ width: 48, height: 48, mr: 2, bgcolor: theme.palette.primary.main }}
                  >
                    {customer.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {customer.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <StatChip
                    icon={<ReceiptIcon />}
                    label={`${customer.totalBookings} bookings`}
                    size="small"
                    variant="outlined"
                  />
                  <StatChip
                    icon={<MoneyIcon />}
                    label={`$${customer.totalSpent.toFixed(2)}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Last: {formatDate(customer.lastBooking)}
                  </Typography>
                </Box>

                {customer.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </CustomerCard>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Container>
  );
};

export default CustomersPage;