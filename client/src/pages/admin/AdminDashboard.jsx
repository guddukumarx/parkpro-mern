// // // src/components/admin/AdminDashboard.jsx
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Container,
// //   Typography,
// //   Box,
// //   Grid,
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   Button,
// //   Avatar,
// //   Chip,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   ListItemAvatar,
// //   Divider,
// //   IconButton,
// //   Paper,
// //   Skeleton,
// //   useTheme,
// //   Alert,
// //   AlertTitle,
// // } from '@mui/material';
// // import { styled } from '@mui/material/styles';
// // import {
// //   TrendingUp as TrendingUpIcon,
// //   TrendingDown as TrendingDownIcon,
// //   AttachMoney as AttachMoneyIcon,
// //   People as PeopleIcon,
// //   Storefront as StorefrontIcon,
// //   LocalParking as ParkingIcon,
// //   Assessment as AssessmentIcon,
// //   Add as AddIcon,
// //   BarChart as BarChartIcon,
// //   Receipt as ReceiptIcon,
// //   DirectionsCar as DirectionsCarIcon,
// //   Person as PersonIcon,
// //   AccessTime as AccessTimeIcon,
// //   Notifications as NotificationsIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Warning as WarningIcon,
// //   Error as ErrorIcon,
// //   Info as InfoIcon,
// // } from '@mui/icons-material';

// // // Recharts imports
// // import {
// //   AreaChart,
// //   Area,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip as RechartsTooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   BarChart,
// //   Bar,
// // } from 'recharts';

// // // Custom styled components
// // const StyledCard = styled(Card)(({ theme }) => ({
// //   backgroundColor: theme.palette.background.paper,
// //   color: theme.palette.text.secondary,
// //   height: '100%',
// //   transition: 'transform 0.2s, box-shadow 0.2s',
// //   '&:hover': {
// //     transform: 'translateY(-2px)',
// //     boxShadow: theme.shadows[4],
// //   },
// // }));

// // const StatCard = styled(Box)(({ theme }) => ({
// //   backgroundColor: theme.palette.background.paper,
// //   color: theme.palette.text.secondary,
// //   padding: theme.spacing(2),
// //   borderRadius: theme.shape.borderRadius,
// //   height: '100%',
// //   display: 'flex',
// //   flexDirection: 'column',
// //   justifyContent: 'center',
// //   boxShadow: theme.shadows[1],
// // }));

// // const IconWrapper = styled(Box)(({ theme, color }) => ({
// //   display: 'inline-flex',
// //   alignItems: 'center',
// //   justifyContent: 'center',
// //   width: 48,
// //   height: 48,
// //   borderRadius: '50%',
// //   backgroundColor: color || theme.palette.primary.main,
// //   color: theme.palette.text.primary,
// //   marginBottom: theme.spacing(1),
// // }));

// // const StatusChip = styled(Chip)(({ theme, status }) => {
// //   let bgColor;
// //   switch (status) {
// //     case 'approved':
// //     case 'active':
// //       bgColor = theme.palette.success.main;
// //       break;
// //     case 'pending':
// //       bgColor = theme.palette.warning.main;
// //       break;
// //     case 'rejected':
// //     case 'blocked':
// //       bgColor = theme.palette.error.main;
// //       break;
// //     default:
// //       bgColor = theme.palette.grey[500];
// //   }
// //   return {
// //     backgroundColor: bgColor,
// //     color: theme.palette.getContrastText(bgColor),
// //     fontWeight: 600,
// //     fontSize: '0.75rem',
// //     height: 24,
// //   };
// // });

// // const AdminDashboard = () => {
// //   const theme = useTheme();

// //   // Loading state
// //   const [loading, setLoading] = useState(true);

// //   // Mock data
// //   const [stats, setStats] = useState(null);
// //   const [revenueData, setRevenueData] = useState([]);
// //   const [bookingStatusData, setBookingStatusData] = useState([]);
// //   const [recentActivity, setRecentActivity] = useState([]);
// //   const [pendingOwners, setPendingOwners] = useState([]);
// //   const [alerts, setAlerts] = useState([]);

// //   useEffect(() => {
// //     // Simulate API call
// //     setTimeout(() => {
// //       setStats({
// //         totalUsers: 8750,
// //         totalOwners: 124,
// //         totalBookings: 12450,
// //         totalRevenue: 284500,
// //         activeBookings: 1850,
// //       });

// //       setRevenueData([
// //         { name: 'Jan', revenue: 28500 },
// //         { name: 'Feb', revenue: 30200 },
// //         { name: 'Mar', revenue: 32400 },
// //         { name: 'Apr', revenue: 34100 },
// //         { name: 'May', revenue: 36500 },
// //         { name: 'Jun', revenue: 38420 },
// //         { name: 'Jul', revenue: 40200 },
// //         { name: 'Aug', revenue: 41800 },
// //         { name: 'Sep', revenue: 39500 },
// //         { name: 'Oct', revenue: 37800 },
// //         { name: 'Nov', revenue: 39200 },
// //         { name: 'Dec', revenue: 41500 },
// //       ]);

// //       setBookingStatusData([
// //         { name: 'Completed', value: 8450 },
// //         { name: 'Active', value: 1850 },
// //         { name: 'Cancelled', value: 1250 },
// //         { name: 'Refunded', value: 600 },
// //         { name: 'Flagged', value: 300 },
// //       ]);

// //       setRecentActivity([
// //         { id: 1, user: 'John Driver', action: 'booked slot A12', time: '5 minutes ago', avatar: 'JD' },
// //         { id: 2, user: 'Jane Owner', action: 'approved new slot pricing', time: '15 minutes ago', avatar: 'JO' },
// //         { id: 3, user: 'Mike Smith', action: 'cancelled booking BK1003', time: '1 hour ago', avatar: 'MS' },
// //         { id: 4, user: 'Sarah Lee', action: 'registered as new owner', time: '2 hours ago', avatar: 'SL' },
// //         { id: 5, user: 'Tom Brown', action: 'requested refund', time: '3 hours ago', avatar: 'TB' },
// //       ]);

// //       setPendingOwners([
// //         { id: 1, name: 'Robert Johnson', email: 'robert.j@example.com', business: 'Downtown Parking LLC', requested: '2026-02-14' },
// //         { id: 2, name: 'Emily Clark', email: 'emily.c@example.com', business: 'City Center Garage', requested: '2026-02-13' },
// //         { id: 3, name: 'David Lee', email: 'david.lee@example.com', business: 'Airport Parking Services', requested: '2026-02-12' },
// //       ]);

// //       setAlerts([
// //         { id: 1, type: 'warning', title: 'Low occupancy at Downtown Garage', message: 'Current occupancy is 35%' },
// //         { id: 2, type: 'error', title: 'Payment gateway delay', message: 'Some transactions are taking longer than usual' },
// //         { id: 3, type: 'info', title: 'New owner registration', message: '3 new owners pending approval' },
// //         { id: 4, type: 'success', title: 'System update', message: 'All systems operational' },
// //       ]);

// //       setLoading(false);
// //     }, 1000);
// //   }, []);

// //   // Colors for pie chart
// //   const COLORS = [
// //     theme.palette.success.main,
// //     theme.palette.primary.main,
// //     theme.palette.error.main,
// //     theme.palette.warning.main,
// //     theme.palette.secondary.main,
// //   ];

// //   const formatCurrency = (value) => {
// //     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
// //   };

// //   // Quick actions
// //   const quickActions = [
// //     { label: 'Manage Users', icon: <PeopleIcon />, color: 'primary' },
// //     { label: 'View Reports', icon: <BarChartIcon />, color: 'info' },
// //     { label: 'Pending Approvals', icon: <StorefrontIcon />, color: 'warning' },
// //     { label: 'System Settings', icon: <AssessmentIcon />, color: 'secondary' },
// //   ];

// //   if (loading) {
// //     return (
// //       <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
// //         <Container maxWidth="xl">
// //           <Skeleton variant="rectangular" height={80} sx={{ mb: 4, borderRadius: 2 }} />
// //           <Grid container spacing={3}>
// //             {[...Array(5)].map((_, i) => (
// //               <Grid item xs={12} sm={6} md={2.4} key={i}>
// //                 <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
// //               </Grid>
// //             ))}
// //           </Grid>
// //           <Grid container spacing={4} sx={{ mt: 2 }}>
// //             <Grid item xs={12} md={8}>
// //               <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
// //             </Grid>
// //             <Grid item xs={12} md={4}>
// //               <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
// //             </Grid>
// //           </Grid>
// //         </Container>
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
// //       <Container maxWidth="xl">
// //         {/* Page Header */}
// //         <Typography variant="h4" component="h1" color="text.primary" fontWeight={700} sx={{ mb: 3 }}>
// //           Admin Dashboard
// //         </Typography>

// //         {/* Summary Stat Cards */}
// //         <Grid container spacing={3} sx={{ mb: 4 }}>
// //           <Grid item xs={12} sm={6} md={2.4}>
// //             <StatCard>
// //               <IconWrapper color={theme.palette.info.main}>
// //                 <PeopleIcon />
// //               </IconWrapper>
// //               <Typography variant="body2" color="text.secondary">Total Users</Typography>
// //               <Typography variant="h5" fontWeight={700} color="text.secondary">
// //                 {stats.totalUsers.toLocaleString()}
// //               </Typography>
// //             </StatCard>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2.4}>
// //             <StatCard>
// //               <IconWrapper color={theme.palette.success.main}>
// //                 <StorefrontIcon />
// //               </IconWrapper>
// //               <Typography variant="body2" color="text.secondary">Total Owners</Typography>
// //               <Typography variant="h5" fontWeight={700} color="text.secondary">
// //                 {stats.totalOwners.toLocaleString()}
// //               </Typography>
// //             </StatCard>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2.4}>
// //             <StatCard>
// //               <IconWrapper color={theme.palette.primary.main}>
// //                 <ParkingIcon />
// //               </IconWrapper>
// //               <Typography variant="body2" color="text.secondary">Total Bookings</Typography>
// //               <Typography variant="h5" fontWeight={700} color="text.secondary">
// //                 {stats.totalBookings.toLocaleString()}
// //               </Typography>
// //             </StatCard>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2.4}>
// //             <StatCard>
// //               <IconWrapper color={theme.palette.secondary.main}>
// //                 <AttachMoneyIcon />
// //               </IconWrapper>
// //               <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
// //               <Typography variant="h5" fontWeight={700} color="text.secondary">
// //                 {formatCurrency(stats.totalRevenue)}
// //               </Typography>
// //             </StatCard>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2.4}>
// //             <StatCard>
// //               <IconWrapper color={theme.palette.accent?.main || '#38BDF8'}>
// //                 <DirectionsCarIcon />
// //               </IconWrapper>
// //               <Typography variant="body2" color="text.secondary">Active Bookings</Typography>
// //               <Typography variant="h5" fontWeight={700} color="text.secondary">
// //                 {stats.activeBookings.toLocaleString()}
// //               </Typography>
// //             </StatCard>
// //           </Grid>
// //         </Grid>

// //         {/* Charts Row */}
// //         <Grid container spacing={4} sx={{ mb: 4 }}>
// //           {/* Revenue Analytics Chart */}
// //           <Grid item xs={12} md={8}>
// //             <StyledCard>
// //               <CardHeader
// //                 title="Revenue Analytics"
// //                 subheader="Monthly revenue trend"
// //                 action={
// //                   <IconButton>
// //                     <BarChartIcon />
// //                   </IconButton>
// //                 }
// //               />
// //               <CardContent>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
// //                     <defs>
// //                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
// //                         <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
// //                         <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
// //                       </linearGradient>
// //                     </defs>
// //                     <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
// //                     <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
// //                     <YAxis stroke={theme.palette.text.secondary} tickFormatter={(value) => `$${value/1000}k`} />
// //                     <RechartsTooltip
// //                       formatter={(value) => formatCurrency(value)}
// //                       contentStyle={{
// //                         backgroundColor: theme.palette.background.paper,
// //                         borderColor: theme.palette.divider,
// //                         color: theme.palette.text.secondary,
// //                       }}
// //                     />
// //                     <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} fill="url(#colorRevenue)" />
// //                   </AreaChart>
// //                 </ResponsiveContainer>
// //               </CardContent>
// //             </StyledCard>
// //           </Grid>

// //           {/* Booking Insights (Pie Chart) */}
// //           <Grid item xs={12} md={4}>
// //             <StyledCard>
// //               <CardHeader title="Booking Status" />
// //               <CardContent>
// //                 <ResponsiveContainer width="100%" height={300}>
// //                   <PieChart>
// //                     <Pie
// //                       data={bookingStatusData}
// //                       cx="50%"
// //                       cy="50%"
// //                       innerRadius={60}
// //                       outerRadius={80}
// //                       paddingAngle={2}
// //                       dataKey="value"
// //                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                     >
// //                       {bookingStatusData.map((entry, index) => (
// //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                       ))}
// //                     </Pie>
// //                     <RechartsTooltip
// //                       formatter={(value) => value.toLocaleString()}
// //                       contentStyle={{
// //                         backgroundColor: theme.palette.background.paper,
// //                         borderColor: theme.palette.divider,
// //                         color: theme.palette.text.secondary,
// //                       }}
// //                     />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </CardContent>
// //             </StyledCard>
// //           </Grid>
// //         </Grid>

// //         {/* Recent Activity & Owner Approval Table */}
// //         <Grid container spacing={4} sx={{ mb: 4 }}>
// //           {/* Recent Activity Feed */}
// //           <Grid item xs={12} md={4}>
// //             <StyledCard>
// //               <CardHeader title="Recent Activity" />
// //               <CardContent>
// //                 <List>
// //                   {recentActivity.map((activity, index) => (
// //                     <React.Fragment key={activity.id}>
// //                       <ListItem alignItems="flex-start" sx={{ px: 0 }}>
// //                         <ListItemAvatar>
// //                           <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{activity.avatar}</Avatar>
// //                         </ListItemAvatar>
// //                         <ListItemText
// //                           primary={activity.user}
// //                           secondary={
// //                             <>
// //                               <Typography variant="body2" color="text.secondary" component="span">
// //                                 {activity.action}
// //                               </Typography>
// //                               <Typography variant="caption" color="text.disabled" display="block">
// //                                 {activity.time}
// //                               </Typography>
// //                             </>
// //                           }
// //                         />
// //                       </ListItem>
// //                       {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
// //                     </React.Fragment>
// //                   ))}
// //                 </List>
// //               </CardContent>
// //             </StyledCard>
// //           </Grid>

// //           {/* Owner Approval Table */}
// //           <Grid item xs={12} md={4}>
// //             <StyledCard>
// //               <CardHeader
// //                 title="Pending Owner Approvals"
// //                 action={<Chip label={pendingOwners.length} color="warning" size="small" />}
// //               />
// //               <CardContent>
// //                 {pendingOwners.length === 0 ? (
// //                   <Typography variant="body2" color="text.secondary">No pending approvals</Typography>
// //                 ) : (
// //                   <List>
// //                     {pendingOwners.map((owner, index) => (
// //                       <React.Fragment key={owner.id}>
// //                         <ListItem alignItems="flex-start" sx={{ px: 0 }}>
// //                           <ListItemAvatar>
// //                             <Avatar sx={{ bgcolor: theme.palette.warning.main }}>{owner.name.charAt(0)}</Avatar>
// //                           </ListItemAvatar>
// //                           <ListItemText
// //                             primary={owner.name}
// //                             secondary={
// //                               <>
// //                                 <Typography variant="body2" color="text.secondary" component="span">
// //                                   {owner.business}
// //                                 </Typography>
// //                                 <Typography variant="caption" color="text.disabled" display="block">
// //                                   Requested: {owner.requested}
// //                                 </Typography>
// //                               </>
// //                             }
// //                           />
// //                           <Box sx={{ display: 'flex', gap: 1 }}>
// //                             <IconButton size="small" color="success">
// //                               <CheckCircleIcon fontSize="small" />
// //                             </IconButton>
// //                             <IconButton size="small" color="error">
// //                               <WarningIcon fontSize="small" />
// //                             </IconButton>
// //                           </Box>
// //                         </ListItem>
// //                         {index < pendingOwners.length - 1 && <Divider variant="inset" component="li" />}
// //                       </React.Fragment>
// //                     ))}
// //                   </List>
// //                 )}
// //               </CardContent>
// //             </StyledCard>
// //           </Grid>

// //           {/* Alerts Panel */}
// //           <Grid item xs={12} md={4}>
// //             <StyledCard>
// //               <CardHeader title="System Alerts" />
// //               <CardContent>
// //                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
// //                   {alerts.map((alert) => (
// //                     <Alert
// //                       key={alert.id}
// //                       severity={alert.type}
// //                       sx={{
// //                         backgroundColor: theme.palette.background.paper,
// //                         border: `1px solid ${theme.palette.divider}`,
// //                       }}
// //                     >
// //                       <AlertTitle>{alert.title}</AlertTitle>
// //                       {alert.message}
// //                     </Alert>
// //                   ))}
// //                 </Box>
// //               </CardContent>
// //             </StyledCard>
// //           </Grid>
// //         </Grid>

// //         {/* Quick Action Buttons */}
// //         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
// //           {quickActions.map((action, idx) => (
// //             <Button
// //               key={idx}
// //               variant="contained"
// //               color={action.color}
// //               startIcon={action.icon}
// //               size="large"
// //               sx={{ color: 'text.primary' }}
// //             >
// //               {action.label}
// //             </Button>
// //           ))}
// //         </Box>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default AdminDashboard;

// // src/pages/admin/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Paper,
//   Skeleton,
//   Alert,
//   useTheme,
// } from '@mui/material';
// import {
//   People as PeopleIcon,
//   Storefront as StoreIcon,
//   LocalParking as ParkingIcon,
//   Receipt as BookingIcon,
//   AttachMoney as MoneyIcon,
// } from '@mui/icons-material';
// import adminService from '../../services/adminService';

// const StatCard = ({ icon: Icon, label, value, color, loading }) => (
//   <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: color, color: 'white' }}>
//     <Icon sx={{ fontSize: 40, mr: 2 }} />
//     <Box>
//       <Typography variant="body2">{label}</Typography>
//       <Typography variant="h5">{loading ? <Skeleton width={60} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : value}</Typography>
//     </Box>
//   </Paper>
// );

// const AdminDashboard = () => {
//   const theme = useTheme();
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const response = await adminService.getDashboardStats();
//       setStats(response.data || response);
//     } catch (err) {
//       setError(err.message || 'Failed to load stats');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
//         Admin Dashboard
//       </Typography>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={PeopleIcon} label="Total Users" value={stats.users?.total} loading={loading} color={theme.palette.info.main} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={StoreIcon} label="Owners" value={stats.users?.owners} loading={loading} color={theme.palette.success.main} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={ParkingIcon} label="Parkings" value={stats.parkings} loading={loading} color={theme.palette.warning.main} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={BookingIcon} label="Total Bookings" value={stats.bookings?.total} loading={loading} color={theme.palette.primary.main} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={MoneyIcon} label="Revenue" value={`$${stats.revenue?.toFixed(2)}`} loading={loading} color={theme.palette.secondary.main} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard icon={PeopleIcon} label="Pending Owners" value={stats.users?.pendingOwners} loading={loading} color={theme.palette.error.main} />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default AdminDashboard;

// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Skeleton,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Storefront as StoreIcon,
  LocalParking as ParkingIcon,
  Receipt as BookingIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import adminService from "../../services/adminService";

// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.common.white,
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

const RecentItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getDashboardStats();
      const data = res.data || res;
      setStats(data);

      // Prepare chart data (if revenue data is available)
      // We'll simulate some chart data if not present, but ideally backend provides.
      // Assuming backend returns revenueData as array of { date, revenue }
      if (data.revenueChart) {
        setRevenueData(data.revenueChart);
      } else {
        // Fallback dummy data for demo
        setRevenueData([
          { name: "Mon", revenue: 400 },
          { name: "Tue", revenue: 300 },
          { name: "Wed", revenue: 600 },
          { name: "Thu", revenue: 800 },
          { name: "Fri", revenue: 700 },
          { name: "Sat", revenue: 900 },
          { name: "Sun", revenue: 500 },
        ]);
      }

      // Pie data for user distribution
      if (data.users) {
        setPieData(
          [
            {
              name: "Users",
              value: data.users.total || 0,
              color: theme.palette.info.main,
            },
            {
              name: "Owners",
              value: data.users.owners || 0,
              color: theme.palette.success.main,
            },
            {
              name: "Admins",
              value: data.users.admins || 0,
              color: theme.palette.warning.main,
            },
          ].filter((item) => item.value > 0),
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCardContent = ({ icon, label, value, loading }) => (
    <StyledCard>
      <IconWrapper>{icon}</IconWrapper>
      <Typography variant="h4" fontWeight={700}>
        {loading ? (
          <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
        ) : (
          value
        )}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
    </StyledCard>
  );

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <IconButton onClick={fetchStats} disabled={loading} color="primary">
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <StatCardContent
              icon={<PeopleIcon />}
              label="Total Users"
              value={stats?.users?.total?.toLocaleString() ?? "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <StatCardContent
              icon={<StoreIcon />}
              label="Owners"
              value={stats?.users?.owners?.toLocaleString() ?? "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <StatCardContent
              icon={<ParkingIcon />}
              label="Parkings"
              value={stats?.parkings?.toLocaleString() ?? "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <StatCardContent
              icon={<BookingIcon />}
              label="Total Bookings"
              value={stats?.bookings?.total?.toLocaleString() ?? "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <StatCardContent
              icon={<MoneyIcon />}
              label="Revenue"
              value={stats?.revenue ? `$${stats.revenue.toFixed(2)}` : "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <StatCardContent
              icon={<TrendingUpIcon />}
              label="Pending Owners"
              value={stats?.users?.pendingOwners?.toLocaleString() ?? "-"}
              loading={loading}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={4}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Revenue Overview
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
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
                      dataKey="revenue"
                      stroke={theme.palette.primary.main}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        {/* User Distribution Pie */}
        <Grid item xs={12} md={4}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No data</Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                {pieData.map((item) => (
                  <Box
                    key={item.name}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: item.color,
                        mr: 0.5,
                      }}
                    />
                    <Typography variant="caption">
                      {item.name}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ChartCard>
          </motion.div>
        </Grid>

        {/* Recent Users & Bookings */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : stats?.recent?.users?.length > 0 ? (
                <List>
                  {stats.recent.users.map((user, idx) => (
                    <React.Fragment key={user._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={user.avatar}
                            sx={{ bgcolor: theme.palette.primary.main }}
                          >
                            {user.name?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={`${user.email} • Joined ${new Date(user.createdAt).toLocaleDateString()}`}
                        />
                      </ListItem>
                      {idx < stats.recent.users.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No recent users</Typography>
              )}
            </ChartCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
          >
            <ChartCard>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : stats?.recent?.bookings?.length > 0 ? (
                <List>
                  {stats.recent.bookings.map((booking, idx) => (
                    <React.Fragment key={booking._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                            <BookingIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${booking.user?.name} booked ${booking.parking?.name}`}
                          secondary={`Slot ${booking.slot?.slotNumber} • $${booking.totalPrice?.toFixed(2)}`}
                        />
                      </ListItem>
                      {idx < stats.recent.bookings.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No recent bookings</Typography>
              )}
            </ChartCard>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
