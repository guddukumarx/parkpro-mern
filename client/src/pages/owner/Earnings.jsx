// src/pages/owner/Earnings.jsx
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
  Skeleton,
  Alert,
  useTheme,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";

// Styled components
const StatCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  height: "100%",
  background: `linear-gradient(135deg, ${color || theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  height: "100%",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.2)",
  marginBottom: theme.spacing(1),
}));

const Earnings = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch earnings summary and chart data from backend
      const earningsRes = await ownerService.getOwnerEarnings({ period });
      setSummary(earningsRes.data.summary);
      setChartData(earningsRes.data.chartData || []);

      // Optionally fetch recent payouts
      const payoutsRes = await ownerService.getPayouts({ limit: 5 });
      setPayouts(payoutsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.3 }}
      >
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
            Earnings
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select value={period} label="Period" onChange={handlePeriodChange}>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <StatCard color={theme.palette.info.main}>
              <IconWrapper>
                <MoneyIcon />
              </IconWrapper>
              {loading ? (
                <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight={700}>
                    ${summary.today.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">Today's Earnings</Typography>
                </>
              )}
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <StatCard color={theme.palette.success.main}>
              <IconWrapper>
                <TrendingUpIcon />
              </IconWrapper>
              {loading ? (
                <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight={700}>
                    ${summary.week.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">This Week</Typography>
                </>
              )}
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <StatCard color={theme.palette.warning.main}>
              <IconWrapper>
                <CalendarIcon />
              </IconWrapper>
              {loading ? (
                <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight={700}>
                    ${summary.month.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">This Month</Typography>
                </>
              )}
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <StatCard color={theme.palette.secondary.main}>
              <IconWrapper>
                <ReceiptIcon />
              </IconWrapper>
              {loading ? (
                <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight={700}>
                    ${summary.total.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">Total Earnings</Typography>
                </>
              )}
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Earnings Over Time
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
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
                    <XAxis dataKey="date" />
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
              ) : (
                <Typography>No data available</Typography>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Recent Payouts
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : payouts.length > 0 ? (
                payouts.map((payout) => (
                  <Box
                    key={payout._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ${payout.amount.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={payout.status}
                      size="small"
                      color={
                        payout.status === "paid"
                          ? "success"
                          : payout.status === "pending"
                            ? "warning"
                            : "default"
                      }
                    />
                  </Box>
                ))
              ) : (
                <Typography>No recent payouts</Typography>
              )}
            </ChartCard>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Earnings;
