// src/routes/routeConfig.js
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";
import DiscountIcon from "@mui/icons-material/Discount";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import DownloadIcon from "@mui/icons-material/Download";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Public routes (for navigation, not sidebar)
export const publicRoutes = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/services", name: "Services" },
  { path: "/pricing", name: "Pricing" },
  { path: "/contact", name: "Contact" },
  { path: "/login", name: "Login" },
  { path: "/register", name: "Register" },
  { path: "/forgot-password", name: "Forgot Password" },
];

export const staffRoutes = [
  {
    path: "/staff/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    roles: ["staff"],
  },
  {
    path: "/staff/slots",
    name: "Manage Slots",
    icon: LocalParkingIcon,
    roles: ["staff"],
  },
];

// User routes (for user sidebar)
export const userRoutes = [
  {
    path: "/user/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    roles: ["user"],
  },
  {
    path: "/user/book-slot",
    name: "Book Slot",
    icon: LocalParkingIcon,
    roles: ["user"],
  },
  {
    path: "/user/bookings",
    name: "My Bookings",
    icon: ReceiptIcon,
    roles: ["user"],
  },
  {
    path: "/user/payments",
    name: "Payments",
    icon: PaymentIcon,
    roles: ["user"],
  },
  { path: "/user/profile", name: "Profile", icon: PersonIcon, roles: ["user"] },
  {
    path: "/user/support",
    name: "Support",
    icon: SupportIcon,
    roles: ["user"],
  },
  {
    path: "/user/notifications",
    name: "Notifications",
    icon: NotificationsIcon,
    roles: ["user"],
  },
];

// Owner routes (for owner sidebar) – UPDATED: all parking-specific pages have generic paths
export const ownerRoutes = [
  {
    path: "/owner/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/parkings",
    name: "My Parkings",
    icon: StorefrontIcon,
    roles: ["owner"],
  },
  // ✅ Manage Slots – generic path, appears in sidebar
  {
    path: "/owner/slots",
    name: "Manage Slots",
    icon: LocalParkingIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/earnings",
    name: "Earnings",
    icon: AttachMoneyIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/customers",
    name: "Customers",
    icon: PeopleIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/reports",
    name: "Reports",
    icon: AssessmentIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/coupons",
    name: "Coupons",
    icon: DiscountIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/payouts",
    name: "Payouts",
    icon: PaymentIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/maintenance",
    name: "Maintenance",
    icon: BuildIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/settings",
    name: "Settings",
    icon: SettingsIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/notifications",
    name: "Notifications",
    icon: NotificationsIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/monitor",
    name: "Live Monitor",
    icon: VisibilityIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/calendar",
    name: "Booking Calendar",
    icon: CalendarTodayIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/export",
    name: "Export Data",
    icon: DownloadIcon,
    roles: ["owner"],
  },
  {
    path: "/owner/tax-reports",
    name: "Tax Reports",
    icon: AssessmentIcon,
    roles: ["owner"],
  },
  // ✅ Blacklist – generic path, now visible in sidebar
  {
    path: "/owner/blacklist",
    name: "Blacklist",
    icon: BlockIcon,
    roles: ["owner"],
  },
  // ✅ Operating Hours – generic path, now visible in sidebar
  {
    path: "/owner/hours",
    name: "Operating Hours",
    icon: HistoryIcon,
    roles: ["owner"],
  },
  // ✅ Cancellation Policy – generic path, now visible in sidebar
  {
    path: "/owner/cancellation",
    name: "Cancellation Policy",
    icon: SettingsIcon,
    roles: ["owner"],
  },
];

// Admin routes (for admin sidebar)
export const adminRoutes = [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    roles: ["admin"],
  },
  { path: "/admin/users", name: "Users", icon: PeopleIcon, roles: ["admin"] },
  {
    path: "/admin/owner-approvals",
    name: "Owner Approvals",
    icon: PersonIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/parkings",
    name: "Parkings",
    icon: StorefrontIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/bookings",
    name: "Bookings",
    icon: ReceiptIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/payments",
    name: "Payments",
    icon: PaymentIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/reports",
    name: "Reports",
    icon: AssessmentIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/coupons",
    name: "Coupons",
    icon: DiscountIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/audit-logs",
    name: "Audit Logs",
    icon: HistoryIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/settings",
    name: "Settings",
    icon: SettingsIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/profile",
    name: "Profile",
    icon: PersonIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/notifications",
    name: "Notifications",
    icon: NotificationsIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/email-templates",
    name: "Email Templates",
    icon: EmailIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/export",
    name: "Data Export",
    icon: DownloadIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/maintenance",
    name: "Maintenance",
    icon: BuildIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/payouts",
    name: "Payouts",
    icon: AttachMoneyIcon,
    roles: ["admin"],
  },
  {
    path: "/admin/blacklist",
    name: "Blacklist",
    icon: BlockIcon,
    roles: ["admin"],
  },
];

// Combined config for all authenticated routes (optional)
export const allAuthenticatedRoutes = [
  ...userRoutes,
  ...staffRoutes,
  ...ownerRoutes,
  ...adminRoutes,
];

// Helper to get routes for a specific role (excluding hidden ones)
export const getRoutesByRole = (role) => {
  const allRoutes = [
    ...staffRoutes,
    ...userRoutes,
    ...ownerRoutes,
    ...adminRoutes,
  ];
  return allRoutes.filter(
    (route) => route.roles && route.roles.includes(role) && !route.hidden,
  );
};
