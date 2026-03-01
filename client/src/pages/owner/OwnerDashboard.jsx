// src/pages/owner/OwnerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ add this import
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AttachMoney as MoneyIcon,
  LocalParking as ParkingIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import parkingService from "../../services/parkingService";
import bookingService from "../../services/bookingService";

// Styled components
const StyledCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: color || theme.palette.primary.main,
  color: theme.palette.getContrastText(color || theme.palette.primary.main),
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.2)",
  color: theme.palette.common.white,
  marginBottom: theme.spacing(1),
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  height: "100%",
}));

const OwnerDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    todayEarnings: 0,
    monthlyEarnings: 0,
    totalBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [earningsChart, setEarningsChart] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch owner's parkings
      const parkingsRes = await parkingService.getOwnerParkings();
      const ownerParkings = parkingsRes.data || parkingsRes;
      setParkings(ownerParkings);

      // Fetch owner's bookings (with limit large enough)
      const bookingsRes = await bookingService.fetchOwnerBookings({
        limit: 100,
      });
      const ownerBookings = bookingsRes.data || bookingsRes;
      setBookings(ownerBookings);

      // Compute stats
      let totalSlots = 0;
      let occupiedSlots = 0;
      ownerParkings.forEach((p) => {
        totalSlots += p.totalSlots || 0;
        // We don't have occupiedSlots directly; we'll approximate from active bookings.
      });

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let todayEarnings = 0;
      let monthlyEarnings = 0;
      const paidBookings = ownerBookings.filter(
        (b) => b.paymentStatus === "paid",
      );
      paidBookings.forEach((b) => {
        const bDate = new Date(b.createdAt);
        if (bDate >= today) todayEarnings += b.totalPrice || 0;
        if (bDate >= startOfMonth) monthlyEarnings += b.totalPrice || 0;
      });

      // Count active bookings as occupied slots (simplified)
      const activeBookings = ownerBookings.filter((b) => b.status === "active");
      occupiedSlots = activeBookings.length; // rough, but acceptable

      // Recent bookings (last 5)
      const recent = ownerBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(recent);

      // Earnings chart for last 7 days
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        const dayEnd = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
        );
        const dayEarnings = paidBookings
          .filter(
            (b) =>
              new Date(b.createdAt) >= dayStart &&
              new Date(b.createdAt) < dayEnd,
          )
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        chartData.push({
          name: date.toLocaleDateString("en-US", { weekday: "short" }),
          earnings: dayEarnings,
        });
      }
      setEarningsChart(chartData);

      setStats({
        totalSlots,
        occupiedSlots,
        todayEarnings,
        monthlyEarnings,
        totalBookings: ownerBookings.length,
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Welcome, {user?.name || "Owner"}!
        </Typography>
        <IconButton onClick={fetchData} disabled={loading} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <StyledCard color={theme.palette.info.main}>
              <IconWrapper>
                <ParkingIcon />
              </IconWrapper>
              <Typography variant="h4" fontWeight={700}>
                {loading ? (
                  <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                ) : (
                  stats.totalSlots
                )}
              </Typography>
              <Typography variant="body2">Total Slots</Typography>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <StyledCard color={theme.palette.success.main}>
              <IconWrapper>
                <TrendingUpIcon />
              </IconWrapper>
              <Typography variant="h4" fontWeight={700}>
                {loading ? (
                  <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                ) : (
                  stats.occupiedSlots
                )}
              </Typography>
              <Typography variant="body2">Occupied</Typography>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <StyledCard color={theme.palette.warning.main}>
              <IconWrapper>
                <MoneyIcon />
              </IconWrapper>
              <Typography variant="h4" fontWeight={700}>
                {loading ? (
                  <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                ) : (
                  `$${stats.todayEarnings.toFixed(2)}`
                )}
              </Typography>
              <Typography variant="body2">Today's Earnings</Typography>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <StyledCard color={theme.palette.secondary.main}>
              <IconWrapper>
                <PeopleIcon />
              </IconWrapper>
              <Typography variant="h4" fontWeight={700}>
                {loading ? (
                  <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                ) : (
                  stats.totalBookings
                )}
              </Typography>
              <Typography variant="body2">Total Bookings</Typography>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={4}>
        {/* Earnings Chart */}
        <Grid item xs={12} md={7}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Last 7 Days Earnings
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={earningsChart}>
                    <defs>
                      <linearGradient
                        id="colorEarnings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke={theme.palette.primary.main}
                      fill="url(#colorEarnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={5}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : recentBookings.length > 0 ? (
                <List>
                  {recentBookings.map((b, idx) => (
                    <React.Fragment key={b._id}>
                      <ListItem>
                        <ListItemText
                          primary={`${b.user?.name || "Customer"} - ${b.parking?.name || "Parking"}`}
                          secondary={`Slot ${b.slot?.slotNumber || "?"} • $${b.totalPrice?.toFixed(2)} • ${new Date(b.createdAt).toLocaleDateString()}`}
                        />
                      </ListItem>
                      {idx < recentBookings.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No recent bookings
                </Typography>
              )}
            </ChartCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/owner/parkings"
        >
          Manage Parkings
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/owner/slots"
        >
          Manage Slots
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/owner/earnings"
        >
          View Earnings
        </Button>
      </Box>
    </Container>
  );
};

export default OwnerDashboard;
