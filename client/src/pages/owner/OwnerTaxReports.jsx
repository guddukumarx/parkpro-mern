// src/pages/owner/OwnerTaxReports.jsx
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
  Card,
  CardContent,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AttachMoney, Receipt, TrendingUp } from "@mui/icons-material";
import ownerService from "../../services/ownerService";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  height: "100%",
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.common.white,
}));

const OwnerTaxReports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(1);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    totalTax: 0,
    taxableAmount: 0,
    taxRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [period, year, month, quarter]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { period, year };
      if (period === "monthly") params.month = month;
      else if (period === "quarterly") params.month = (quarter - 1) * 3 + 1; // first month of quarter
      const res = await ownerService.getTaxReports(params);
      setData(res.data || []);
      setSummary(
        res.summary || {
          totalEarnings: 0,
          totalTax: 0,
          taxableAmount: 0,
          taxRate: 0,
        },
      );
    } catch (err) {
      setError(err.message || "Failed to load tax reports");
    } finally {
      setLoading(false);
    }
  };

  const years = [];
  for (let y = 2020; y <= new Date().getFullYear(); y++) {
    years.push(y);
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const quarters = [
    { value: 1, label: "Q1 (Jan–Mar)" },
    { value: 2, label: "Q2 (Apr–Jun)" },
    { value: 3, label: "Q3 (Jul–Sep)" },
    { value: 4, label: "Q4 (Oct–Dec)" },
  ];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div variants={variants} initial="hidden" animate="visible">
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Tax Reports
        </Typography>
      </motion.div>

      {/* Filters */}
      <FilterPaper>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select
                  value={month}
                  label="Month"
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {period === "quarterly" && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Quarter</InputLabel>
                <Select
                  value={quarter}
                  label="Quarter"
                  onChange={(e) => setQuarter(e.target.value)}
                >
                  {quarters.map((q) => (
                    <MenuItem key={q.value} value={q.value}>
                      {q.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </FilterPaper>

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
            <StatCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Total Earnings</Typography>
                  <AttachMoney />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? (
                    <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                  ) : (
                    `$${summary.totalEarnings.toFixed(2)}`
                  )}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <StatCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Tax Rate</Typography>
                  <TrendingUp />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? <Skeleton /> : `${summary.taxRate}%`}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <StatCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Total Tax</Typography>
                  <Receipt />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading ? <Skeleton /> : `$${summary.totalTax.toFixed(2)}`}
                </Typography>
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Tax Breakdown
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : data.length === 0 ? (
                <Typography align="center">
                  No data for selected period.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke={theme.palette.primary.main}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={theme.palette.success.main}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="earnings"
                      fill={theme.palette.primary.main}
                      name="Earnings ($)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="tax"
                      fill={theme.palette.success.main}
                      name="Tax ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Optional: Line chart for trend if data is more than one point */}
      {data.length > 1 && (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Earnings Trend
                </Typography>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke={theme.palette.primary.main}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OwnerTaxReports;
