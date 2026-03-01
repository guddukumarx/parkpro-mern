import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";

// Public pages (same as before)
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Contact = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const FAQ = lazy(() => import("../pages/FAQ"));
const Help = lazy(() => import("../pages/Help"));
const Sitemap = lazy(() => import("../pages/Sitemap"));
const Cookies = lazy(() => import("../pages/Cookies"));
const Disclaimer = lazy(() => import("../pages/Disclaimer"));
const Accessibility = lazy(() => import("../pages/Accessibility"));
const Blog = lazy(() => import("../pages/Blog"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Careers = lazy(() => import("../pages/Careers"));
const Terms = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/Privacy"));
const Support = lazy(() => import("../pages/Support"));

// User pages
const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
const MyBookings = lazy(() => import("../pages/user/MyBookings"));
const UserProfile = lazy(() => import("../pages/user/Profile"));
const UserPayments = lazy(() => import("../pages/user/Payments"));
const UserSupport = lazy(() => import("../pages/user/Support"));
const BookSlot = lazy(() => import("../pages/user/BookSlot"));
const UserSettings = lazy(() => import("../pages/user/UserSettings"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));

// Owner pages
const OwnerDashboard = lazy(() => import("../pages/owner/OwnerDashboard"));
const OwnerParkings = lazy(() => import("../pages/owner/OwnerParkings"));
const ManageSlots = lazy(() => import("../pages/owner/ManageSlots"));
const Earnings = lazy(() => import("../pages/owner/Earnings"));
const OwnerCustomers = lazy(() => import("../pages/owner/OwnerCustomers"));
const OwnerReports = lazy(() => import("../pages/owner/OwnerReports"));
const OwnerSettings = lazy(() => import("../pages/owner/OwnerSettings"));
const OwnerPayouts = lazy(() => import("../pages/owner/OwnerPayouts"));
const OwnerCoupons = lazy(() => import("../pages/owner/OwnerCoupons"));
const OwnerMaintenance = lazy(() => import("../pages/owner/OwnerMaintenance"));
const OwnerBlacklist = lazy(() => import("../pages/owner/OwnerBlacklist"));
const OwnerSlotMonitor = lazy(() => import("../pages/owner/OwnerSlotMonitor"));
const OwnerBookingCalendar = lazy(
  () => import("../pages/owner/OwnerBookingCalendar"),
);
const OwnerDataExport = lazy(() => import("../pages/owner/OwnerDataExport"));
const OwnerTaxReports = lazy(() => import("../pages/owner/OwnerTaxReports"));
const OwnerOperatingHours = lazy(
  () => import("../pages/owner/OwnerOperatingHours"),
);
const OwnerCancellationPolicy = lazy(
  () => import("../pages/owner/OwnerCancellationPolicy"),
);

// Staff pages
const StaffDashboard = lazy(() => import("../pages/staff/StaffDashboard"));
const StaffSlots = lazy(() => import("../pages/staff/StaffSlots"));

// Admin pages (unchanged)
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const AdminOwnerApprovals = lazy(
  () => import("../pages/admin/AdminOwnerApprovals"),
);
const AdminParkings = lazy(() => import("../pages/admin/AdminParkings"));
const ManageBookings = lazy(() => import("../pages/admin/ManageBookings"));
const AdminPayments = lazy(() => import("../pages/admin/AdminPayments"));
const AdminReports = lazy(() => import("../pages/admin/Reports"));
const ManageCoupons = lazy(() => import("../pages/admin/ManageCoupons"));
const AuditLogs = lazy(() => import("../pages/admin/AuditLogs"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminProfile = lazy(() => import("../pages/admin/AdminProfile"));
const AdminNotifications = lazy(
  () => import("../pages/admin/AdminNotifications"),
);
const EmailTemplates = lazy(() => import("../pages/admin/EmailTemplates"));
const DataExport = lazy(() => import("../pages/admin/DataExport"));
const AdminMaintenance = lazy(() => import("../pages/admin/AdminMaintenance"));
const AdminPayouts = lazy(() => import("../pages/admin/AdminPayouts"));
const AdminBlacklist = lazy(() => import("../pages/admin/AdminBlacklist"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader type="fullscreen" text="Loading..." />}>
      <Routes>
        {/* Public Routes (unchanged) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* User Routes (unchanged) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/payments" element={<UserPayments />} />
          <Route path="/user/support" element={<UserSupport />} />
          <Route path="/user/book-slot" element={<BookSlot />} />
          <Route path="/user/notifications" element={<NotificationsPage />} />
          <Route path="/user/settings" element={<UserSettings />} />
        </Route>

        {/* Owner Routes – UPDATED with generic paths */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/parkings" element={<OwnerParkings />} />

          {/* ✅ New generic paths (without :parkingId) */}
          <Route path="/owner/slots" element={<ManageSlots />} />
          <Route path="/owner/blacklist" element={<OwnerBlacklist />} />
          <Route path="/owner/hours" element={<OwnerOperatingHours />} />
          <Route
            path="/owner/cancellation"
            element={<OwnerCancellationPolicy />}
          />

          {/* Other owner pages (unchanged) */}
          <Route path="/owner/earnings" element={<Earnings />} />
          <Route path="/owner/customers" element={<OwnerCustomers />} />
          <Route path="/owner/reports" element={<OwnerReports />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
          <Route path="/owner/payouts" element={<OwnerPayouts />} />
          <Route path="/owner/coupons" element={<OwnerCoupons />} />
          <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
          <Route path="/owner/notifications" element={<NotificationsPage />} />
          <Route path="/owner/monitor" element={<OwnerSlotMonitor />} />
          <Route path="/owner/calendar" element={<OwnerBookingCalendar />} />
          <Route path="/owner/export" element={<OwnerDataExport />} />
          <Route path="/owner/tax-reports" element={<OwnerTaxReports />} />
        </Route>

        {/* Admin Routes (unchanged) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route
            path="/admin/owner-approvals"
            element={<AdminOwnerApprovals />}
          />
          <Route path="/admin/parkings" element={<AdminParkings />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/coupons" element={<ManageCoupons />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/email-templates" element={<EmailTemplates />} />
          <Route path="/admin/export" element={<DataExport />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/blacklist" element={<AdminBlacklist />} />
        </Route>

        {/* Staff Routes (unchanged) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/slots" element={<StaffSlots />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
