// src/pages/Services.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DirectionsCar as CarIcon,
  Storefront as StoreIcon,
  Search as SearchIcon,
  BookOnline as BookIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  LocalParking as ParkingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  SupportAgent as SupportIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#ffffff",
  padding: theme.spacing(12, 2),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)`,
    clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -10,
    left: "50%",
    transform: "translateX(-50%)",
    width: 80,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: "inline-flex",
  padding: theme.spacing(1.5),
  borderRadius: "50%",
  backgroundColor: color || theme.palette.primary.main,
  color: "#fff",
  marginBottom: theme.spacing(2),
  width: 60,
  height: 60,
  alignItems: "center",
  justifyContent: "center",
}));

const PricingCard = styled(Paper)(({ theme, featured }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  height: "100%",
  border: featured ? `2px solid ${theme.palette.primary.main}` : "none",
  boxShadow: featured ? theme.shadows[4] : theme.shadows[1],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[8],
  },
}));

const Services = () => {
  const theme = useTheme();

  const driverServices = [
    {
      icon: <SearchIcon />,
      title: "Real-Time Search",
      description: "Find available parking spots instantly with live updates.",
    },
    {
      icon: <BookIcon />,
      title: "Easy Booking",
      description: "Reserve your spot in just a few taps, anytime, anywhere.",
    },
    {
      icon: <PaymentIcon />,
      title: "Secure Payments",
      description: "Multiple payment options with end-to-end encryption.",
    },
    {
      icon: <TimeIcon />,
      title: "Save Time",
      description: "No more circling the block – go directly to your spot.",
    },
    {
      icon: <CarIcon />,
      title: "Multiple Vehicle Types",
      description: "Car, bike, EV, handicapped – we support all.",
    },
    {
      icon: <SupportIcon />,
      title: "24/7 Support",
      description: "Our team is always here to assist you.",
    },
  ];

  const ownerServices = [
    {
      icon: <DashboardIcon />,
      title: "Owner Dashboard",
      description: "Manage your parkings, slots, and earnings from one place.",
    },
    {
      icon: <SpeedIcon />,
      title: "Real-Time Monitoring",
      description: "Live view of slot occupancy and check-ins/outs.",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Dynamic Pricing",
      description: "Set peak pricing rules to maximize revenue.",
    },
    {
      icon: <AssessmentIcon />,
      title: "Detailed Reports",
      description: "Revenue, occupancy, tax reports to track performance.",
    },
    {
      icon: <PeopleIcon />,
      title: "Customer Management",
      description: "View customer history and manage blacklist.",
    },
    {
      icon: <SecurityIcon />,
      title: "Staff Management",
      description: "Add staff with custom permissions.",
    },
    {
      icon: <SettingsIcon />,
      title: "Custom Policies",
      description: "Set operating hours, holidays, cancellation policies.",
    },
    {
      icon: <MoneyIcon />,
      title: "Easy Payouts",
      description: "Request payouts and view transaction history.",
    },
  ];

  const benefits = [
    "Increase occupancy with real-time availability",
    "Reduce operational costs with automation",
    "Gain insights with detailed analytics",
    "Improve customer satisfaction",
    "Contactless entry/exit for safety",
    "Eco-friendly – reduce emissions",
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Our Services
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Comprehensive parking solutions for drivers and parking owners.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
            sx={{
              backgroundColor: "#fff",
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            Get Started
          </Button>
        </Container>
      </HeroSection>

      {/* For Drivers */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          For Drivers
        </SectionTitle>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
        >
          Everything you need to find, book, and pay for parking effortlessly.
        </Typography>
        <Grid container spacing={4}>
          {driverServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ServiceCard>
                <IconWrapper color={theme.palette.primary.main}>
                  {service.icon}
                </IconWrapper>
                <Typography variant="h5" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
          >
            Sign Up as Driver
          </Button>
        </Box>
      </Container>

      <Divider />

      {/* For Owners */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          For Parking Owners
        </SectionTitle>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
        >
          Powerful tools to manage your parking lots and maximize revenue.
        </Typography>
        <Grid container spacing={4}>
          {ownerServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ServiceCard>
                <IconWrapper color={theme.palette.secondary.main}>
                  {service.icon}
                </IconWrapper>
                <Typography variant="h5" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register?role=owner"
          >
            List Your Parking
          </Button>
        </Box>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3" align="center">
            Why Choose ParkPro?
          </SectionTitle>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body1">{benefit}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Overview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Transparent Pricing
        </SectionTitle>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Choose the plan that fits your needs. No hidden fees.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing Card 1: Free (Driver) */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured={false}>
              <Typography variant="h5" gutterBottom>
                Free Driver
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                forever free
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Search & book parking" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Real-time availability" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Secure payments" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="24/7 support" />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/register"
                sx={{ mt: 2 }}
              >
                Sign Up Free
              </Button>
            </PricingCard>
          </Grid>

          {/* Pricing Card 2: Premium Driver (Monthly) */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured>
              <Typography variant="h5" gutterBottom>
                Premium Driver
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                $9.99
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per month
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="All Free features" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Discounted rates" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Priority booking" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Cancel anytime" />
                </ListItem>
              </List>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{ mt: 2 }}
              >
                Get Premium
              </Button>
            </PricingCard>
          </Grid>

          {/* Pricing Card 3: Pay-per-Use */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured={false}>
              <Typography variant="h5" gutterBottom>
                Pay-per-Use
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                Varies
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per hour
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="No subscription" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Pay only when you park" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Real-time rates" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="No commitment" />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/register"
                sx={{ mt: 2 }}
              >
                Start Parking
              </Button>
            </PricingCard>
          </Grid>

          {/* Pricing Card 4: Basic Owner */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured={false}>
              <Typography variant="h5" gutterBottom>
                Basic Owner
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                5%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per booking
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Owner dashboard" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Slot management" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Basic reports" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Payouts" />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/register?role=owner"
                sx={{ mt: 2 }}
              >
                List Your Parking
              </Button>
            </PricingCard>
          </Grid>

          {/* Pricing Card 5: Pro Owner */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured>
              <Typography variant="h5" gutterBottom>
                Pro Owner
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                3%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per booking
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="All Basic features" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Dynamic pricing" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Staff management" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Advanced reports" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Priority support" />
                </ListItem>
              </List>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register?role=owner"
                sx={{ mt: 2 }}
              >
                Go Pro
              </Button>
            </PricingCard>
          </Grid>

          {/* Pricing Card 6: Enterprise Owner */}
          <Grid item xs={12} sm={6} md={4}>
            <PricingCard featured={false}>
              <Typography variant="h5" gutterBottom>
                Enterprise
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                Custom
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                for large lots
              </Typography>
              <List sx={{ textAlign: "left" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="All Pro features" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Dedicated account manager" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="API access" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Custom integration" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Volume discounts" />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/contact"
                sx={{ mt: 2 }}
              >
                Contact Sales
              </Button>
            </PricingCard>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to transform your parking experience?
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", opacity: 0.95 }}
          >
            Join thousands of satisfied users and parking owners. Start today!
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{
                backgroundColor: "#fff",
                color: theme.palette.primary.main,
                px: 4,
              }}
            >
              Sign Up as Driver
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/register?role=owner"
              sx={{ color: "#fff", borderColor: "#fff", px: 4 }}
            >
              List Your Parking
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Services;
