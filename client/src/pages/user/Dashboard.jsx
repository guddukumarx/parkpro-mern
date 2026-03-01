// src/pages/user/Dashboard.jsx
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
  Chip,
  Skeleton,
  Paper,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalParking as ParkingIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MoneyIcon,
  DirectionsCar as CarIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bookingService from "../../services/bookingService";

const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.getContrastText(color || theme.palette.primary.main),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.spacing(1),
  height: "100%",
}));

const UserDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch user's bookings (limit high to calculate stats, but we only show recent)
        const response = await bookingService.fetchUserBookings({ limit: 50 });
        const bookings = response.data || response;

        const now = new Date();
        const upcoming = bookings.filter((b) => new Date(b.startTime) > now);
        const past = bookings.filter((b) => new Date(b.endTime) < now);

        // Show only first 5 each
        setUpcomingBookings(upcoming.slice(0, 5));
        setPastBookings(past.slice(0, 5));

        // Calculate stats
        const totalBookings = bookings.length;
        const upcomingCount = upcoming.length;
        const totalSpent = bookings
          .filter((b) => b.paymentStatus === "paid")
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        setStats({
          total: totalBookings,
          upcoming: upcomingCount,
          spent: totalSpent,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Welcome, {user?.name || "User"}!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard color={theme.palette.info.main}>
            <ParkingIcon fontSize="large" />
            <Typography variant="h5">
              {loading ? <Skeleton width={60} /> : stats.total}
            </Typography>
            <Typography variant="body2">Total Bookings</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard color={theme.palette.success.main}>
            <CalendarIcon fontSize="large" />
            <Typography variant="h5">
              {loading ? <Skeleton width={60} /> : stats.upcoming}
            </Typography>
            <Typography variant="body2">Upcoming</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard color={theme.palette.warning.main}>
            <MoneyIcon fontSize="large" />
            <Typography variant="h5">
              ${loading ? <Skeleton width={60} /> : stats.spent.toFixed(2)}
            </Typography>
            <Typography variant="body2">Total Spent</Typography>
          </StatCard>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Upcoming Bookings */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Bookings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : upcomingBookings.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CarIcon
                    sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 1 }}
                  />
                  <Typography color="text.secondary">
                    No upcoming bookings
                  </Typography>
                  <Button
                    component={Link}
                    to="/user/book-slot"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Book Now
                  </Button>
                </Box>
              ) : (
                upcomingBookings.map((booking) => (
                  <Box
                    key={booking._id}
                    sx={{
                      mb: 2,
                      p: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {booking.parking?.name || "Parking"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(booking.startTime)} –{" "}
                      {formatDate(booking.endTime)}
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
                        size="small"
                        label={booking.status}
                        color="primary"
                      />
                      <Typography variant="body2" fontWeight={600}>
                        ${booking.totalPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/user/bookings"
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                View All
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Recent Activity (Past Bookings) */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : pastBookings.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <HistoryIcon
                    sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 1 }}
                  />
                  <Typography color="text.secondary">
                    No past bookings yet
                  </Typography>
                </Box>
              ) : (
                pastBookings.map((booking) => (
                  <Box
                    key={booking._id}
                    sx={{
                      mb: 2,
                      p: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {booking.parking?.name || "Parking"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(booking.startTime).toLocaleDateString()}
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
                        size="small"
                        label={booking.status}
                        variant="outlined"
                      />
                      <Typography variant="body2" fontWeight={600}>
                        ${booking.totalPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          component={Link}
          to="/user/book-slot"
          variant="contained"
          size="large"
          startIcon={<CarIcon />}
        >
          Book a Slot
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard;
