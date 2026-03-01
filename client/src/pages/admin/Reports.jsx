// src/pages/admin/Reports.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BarChart as BarChartIcon,
  Timeline as LineChartIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import adminService from "../../services/adminService";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 400,
  [theme.breakpoints.down("sm")]: {
    height: 300,
  },
}));

const StatCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [period, setPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  useEffect(() => {
    fetchReports();
  }, [period, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        type: period,
        from: dateRange.startDate,
        to: dateRange.endDate,
      };
      const res = await adminService.getPlatformReports(params);
      setReportData(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) setChartType(newType);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const handleDateChange = (field) => (e) => {
    setDateRange({ ...dateRange, [field]: e.target.value });
  };

  const handleDownload = () => {
    // Implement CSV/PDF download
    alert("Download functionality coming soon");
  };

  const formatRevenueData = () => {
    if (!reportData?.revenue) return [];
    return reportData.revenue.map((item) => ({
      ...item,
      date: item.date,
    }));
  };

  const formatUserGrowthData = () => {
    if (!reportData?.userGrowth) return [];
    return reportData.userGrowth;
  };

  const summaryStats = {
    totalRevenue:
      reportData?.revenue?.reduce((sum, item) => sum + item.revenue, 0) || 0,
    totalUsers:
      reportData?.userGrowth?.reduce((sum, item) => sum + item.newUsers, 0) ||
      0,
    avgRevenue: reportData?.revenue?.length
      ? reportData.revenue.reduce((sum, item) => sum + item.revenue, 0) /
        reportData.revenue.length
      : 0,
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Reports & Analytics
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Download Report">
            <IconButton onClick={handleDownload} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchReports}
              disabled={loading}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <StyledPaper sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={handlePeriodChange}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {period === "custom" && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={handleDateChange("startDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={handleDateChange("endDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              fullWidth
            >
              <ToggleButton value="line">
                <LineChartIcon sx={{ mr: 1 }} /> Line
              </ToggleButton>
              <ToggleButton value="bar">
                <BarChartIcon sx={{ mr: 1 }} /> Bar
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </StyledPaper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={variants}>
              <StatCard>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? (
                    <Skeleton width={100} />
                  ) : (
                    `$${summaryStats.totalRevenue.toFixed(2)}`
                  )}
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={variants}>
              <StatCard>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total New Users
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? <Skeleton width={100} /> : summaryStats.totalUsers}
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div variants={variants}>
              <StatCard>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Avg. Daily Revenue
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? (
                    <Skeleton width={100} />
                  ) : (
                    `$${summaryStats.avgRevenue.toFixed(2)}`
                  )}
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Revenue Over Time
            </Typography>
            <ChartContainer>
              {loading ? (
                <Skeleton variant="rectangular" height="100%" />
              ) : reportData?.revenue?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={formatRevenueData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={formatRevenueData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill={theme.palette.primary.main}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <Typography>No data available</Typography>
              )}
            </ChartContainer>
          </StyledPaper>
        </Grid>

        {/* User Growth Chart */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              User Growth
            </Typography>
            <ChartContainer>
              {loading ? (
                <Skeleton variant="rectangular" height="100%" />
              ) : reportData?.userGrowth?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatUserGrowthData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="newUsers" fill={theme.palette.success.main} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No data available</Typography>
              )}
            </ChartContainer>
          </StyledPaper>
        </Grid>

        {/* Breakdown by Type (Pie Chart - example) */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Bookings by Type
            </Typography>
            <Box
              sx={{ height: 300, display: "flex", justifyContent: "center" }}
            >
              {loading ? (
                <Skeleton variant="circular" width={200} height={200} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Standard", value: 540 },
                        { name: "VIP", value: 320 },
                        { name: "EV", value: 210 },
                        { name: "Handicap", value: 120 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </StyledPaper>
        </Grid>

        {/* Recent Activity Table (simplified) */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="body2">
                      User {item} made a booking
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2h ago
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;
