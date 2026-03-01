// src/pages/owner/OwnerReports.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Skeleton,
  Alert,
  useTheme,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 300,
  [theme.breakpoints.down("sm")]: {
    height: 250,
  },
}));

const OwnerReports = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(1);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgBooking: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      // Build params based on period
      const params = { period, year };
      if (period === "monthly") params.month = month;
      else if (period === "quarterly") params.month = (quarter - 1) * 3 + 1; // first month of quarter

      // Fetch revenue reports (assuming endpoint exists)
      const revenueRes = await ownerService.getRevenueReports(params);
      setRevenueData(revenueRes.data || []);

      // Fetch booking stats (maybe from another endpoint)
      const bookingsRes = await ownerService.getBookingReports(params);
      setBookingsData(bookingsRes.data || []);

      // Compute status data (dummy if not from backend)
      // In real app, you'd fetch status counts from backend
      setStatusData([
        { name: "Confirmed", value: 45, color: theme.palette.info.main },
        { name: "Active", value: 30, color: theme.palette.success.main },
        { name: "Completed", value: 15, color: theme.palette.grey[500] },
        { name: "Cancelled", value: 10, color: theme.palette.error.main },
      ]);

      // Compute summary (could be from backend aggregated)
      const totalRevenue =
        revenueRes.data?.reduce((acc, item) => acc + (item.revenue || 0), 0) ||
        0;
      const totalBookings =
        revenueRes.data?.reduce((acc, item) => acc + (item.bookings || 0), 0) ||
        0;
      setSummary({
        totalRevenue,
        totalBookings,
        avgBooking: totalBookings ? totalRevenue / totalBookings : 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period, year, month, quarter]);

  const handlePeriodChange = (e) => setPeriod(e.target.value);

  const years = [];
  for (let y = 2020; y <= new Date().getFullYear(); y++) years.push(y);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

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
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Reports
        </Typography>
        <IconButton onClick={fetchReports} disabled={loading} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={handlePeriodChange}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {period === "monthly" && (
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select
                  value={month}
                  label="Month"
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <MenuItem key={m} value={m}>
                      {new Date(2000, m - 1, 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {period === "quarterly" && (
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Quarter</InputLabel>
                <Select
                  value={quarter}
                  label="Quarter"
                  onChange={(e) => setQuarter(e.target.value)}
                >
                  <MenuItem value={1}>Q1 (Jan-Mar)</MenuItem>
                  <MenuItem value={2}>Q2 (Apr-Jun)</MenuItem>
                  <MenuItem value={3}>Q3 (Jul-Sep)</MenuItem>
                  <MenuItem value={4}>Q4 (Oct-Dec)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <StyledPaper>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {loading ? (
                  <Skeleton width={80} />
                ) : (
                  `$${summary.totalRevenue.toFixed(2)}`
                )}
              </Typography>
            </StyledPaper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <StyledPaper>
              <Typography variant="body2" color="text.secondary">
                Total Bookings
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {loading ? <Skeleton width={80} /> : summary.totalBookings}
              </Typography>
            </StyledPaper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <StyledPaper>
              <Typography variant="body2" color="text.secondary">
                Average Booking Value
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {loading ? (
                  <Skeleton width={80} />
                ) : (
                  `$${summary.avgBooking.toFixed(2)}`
                )}
              </Typography>
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Revenue Line Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={theme.palette.primary.main}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Grid>

        {/* Bookings Bar Chart */}
        <Grid item xs={12} md={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Bookings by Type
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Grid>

        {/* Booking Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Booking Status
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Grid>

        {/* Additional Occupancy (if needed) */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Parking Occupancy
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={theme.palette.success.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OwnerReports;
