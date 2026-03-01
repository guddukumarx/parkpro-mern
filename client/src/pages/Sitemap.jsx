// src/pages/Sitemap.jsx
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: '#ffffff',
  padding: theme.spacing(12, 2),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)`,
    clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
  },
}));

const Sitemap = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Public Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Forgot Password', path: '/forgot-password' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Help Center', path: '/help' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
        { name: 'Sitemap', path: '/sitemap' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Disclaimer', path: '/disclaimer' },
        { name: 'Accessibility', path: '/accessibility' },
      ],
    },
    {
      title: 'User Pages (after login)',
      links: [
        { name: 'User Dashboard', path: '/user/dashboard' },
        { name: 'Book a Slot', path: '/user/book-slot' },
        { name: 'My Bookings', path: '/user/bookings' },
        { name: 'Payments', path: '/user/payments' },
        { name: 'Profile', path: '/user/profile' },
        { name: 'Support', path: '/user/support' },
        { name: 'Notifications', path: '/user/notifications' },
      ],
    },
    {
      title: 'Owner Pages',
      links: [
        { name: 'Owner Dashboard', path: '/owner/dashboard' },
        { name: 'My Parkings', path: '/owner/parkings' },
        { name: 'Manage Slots', path: '/owner/slots' },
        { name: 'Earnings', path: '/owner/earnings' },
        { name: 'Customers', path: '/owner/customers' },
        { name: 'Reports', path: '/owner/reports' },
        { name: 'Settings', path: '/owner/settings' },
        { name: 'Payouts', path: '/owner/payouts' },
        { name: 'Coupons', path: '/owner/coupons' },
        { name: 'Maintenance', path: '/owner/maintenance' },
        { name: 'Live Monitor', path: '/owner/monitor' },
        { name: 'Booking Calendar', path: '/owner/calendar' },
        { name: 'Export Data', path: '/owner/export' },
        { name: 'Tax Reports', path: '/owner/tax-reports' },
        { name: 'Notifications', path: '/owner/notifications' },
      ],
    },
    {
      title: 'Admin Pages',
      links: [
        { name: 'Admin Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Users', path: '/admin/users' },
        { name: 'Owner Approvals', path: '/admin/owner-approvals' },
        { name: 'Manage Parkings', path: '/admin/parkings' },
        { name: 'Manage Bookings', path: '/admin/bookings' },
        { name: 'Payments', path: '/admin/payments' },
        { name: 'Reports', path: '/admin/reports' },
        { name: 'Coupons', path: '/admin/coupons' },
        { name: 'Audit Logs', path: '/admin/audit-logs' },
        { name: 'Settings', path: '/admin/settings' },
        { name: 'Profile', path: '/admin/profile' },
        { name: 'Notifications', path: '/admin/notifications' },
        { name: 'Email Templates', path: '/admin/email-templates' },
        { name: 'Data Export', path: '/admin/export' },
        { name: 'Maintenance', path: '/admin/maintenance' },
        { name: 'Payouts', path: '/admin/payouts' },
        { name: 'Blacklist', path: '/admin/blacklist' },
      ],
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, mb: 2 }}>
            Sitemap
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            Find all pages on ParkPro easily.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {sections.map((section, idx) => (
              <Grid item xs={12} md={6} lg={4} key={idx}>
                <List
                  subheader={
                    <ListSubheader component="div" sx={{ bgcolor: 'transparent', fontWeight: 600, fontSize: '1.1rem' }}>
                      {section.title}
                    </ListSubheader>
                  }
                >
                  {section.links.map((link, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography
                            component={RouterLink}
                            to={link.path}
                            sx={{
                              textDecoration: 'none',
                              color: theme.palette.text.secondary,
                              '&:hover': { color: theme.palette.primary.main },
                            }}
                          >
                            {link.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {idx < sections.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Sitemap;