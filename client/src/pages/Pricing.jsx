// src/pages/Pricing.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Storefront as StoreIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  SupportAgent as SupportIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#fff",
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

const PricingCard = styled(Card)(({ theme, featured }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: featured ? `2px solid ${theme.palette.primary.main}` : "none",
  boxShadow: featured ? theme.shadows[8] : theme.shadows[2],
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[12],
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2, 0),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: "inline-flex",
  padding: theme.spacing(1),
  borderRadius: "50%",
  backgroundColor: color || theme.palette.primary.main,
  color: "#fff",
  marginBottom: theme.spacing(1),
}));

const Pricing = () => {
  const theme = useTheme();
  const [annual, setAnnual] = useState(false);

  // Plans data (could be fetched from backend later)
  const plans = [
    {
      id: "free",
      name: "Driver",
      icon: <CarIcon />,
      price: 0,
      priceAnnual: 0,
      description: "Perfect for occasional parking",
      features: [
        "Real-time parking search",
        "Book parking slots",
        "View booking history",
        "Basic support",
        "Cancel anytime",
      ],
      notIncluded: [],
      buttonText: "Sign Up Free",
      buttonVariant: "outlined",
      featured: false,
      color: theme.palette.info.main,
    },
    {
      id: "owner",
      name: "Parking Owner",
      icon: <StoreIcon />,
      price: 29.99,
      priceAnnual: 19.99 * 12, // discounted annual
      description: "For small to medium parking lots",
      features: [
        "Manage up to 5 parkings",
        "Slot management",
        "Basic analytics",
        "Staff management (up to 3)",
        "Email support",
        "Payouts",
      ],
      notIncluded: ["Advanced reports", "API access"],
      buttonText: "Start Free Trial",
      buttonVariant: "contained",
      featured: true,
      color: theme.palette.primary.main,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <BusinessIcon />,
      price: 99.99,
      priceAnnual: 79.99 * 12,
      description: "For large operators and chains",
      features: [
        "Unlimited parkings",
        "Advanced analytics & reports",
        "Priority support 24/7",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      notIncluded: [],
      buttonText: "Contact Sales",
      buttonVariant: "outlined",
      featured: false,
      color: theme.palette.secondary.main,
    },
  ];

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes, you can upgrade or downgrade anytime.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes, we offer a 14-day free trial for all plans.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and bank transfers.",
    },
    {
      q: "Do I need a contract?",
      a: "No, all plans are month-to-month with no long-term commitment.",
    },
  ];

  const getPrice = (plan) => {
    const price = annual ? plan.priceAnnual : plan.price;
    if (plan.id === "free") return "Free";
    return `$${price.toFixed(2)}/${annual ? "yr" : "mo"}`;
  };

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
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Choose the plan that fits your needs. No hidden fees.
          </Typography>
        </Container>
      </HeroSection>

      {/* Toggle */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 2, textAlign: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={annual}
              onChange={(e) => setAnnual(e.target.checked)}
            />
          }
          label="Annual billing (save up to 20%)"
        />
      </Container>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {plans.map((plan) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={plan.id}
              sx={{ display: "flex" }}
            >
              <PricingCard featured={plan.featured} sx={{ width: "100%" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <IconWrapper color={plan.color}>{plan.icon}</IconWrapper>
                  </Box>
                  <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    fontWeight={600}
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 2 }}
                  >
                    {plan.description}
                  </Typography>
                  <PriceTag>
                    <Typography variant="h3" color="primary" fontWeight={700}>
                      {getPrice(plan)}
                    </Typography>
                  </PriceTag>
                  <List dense>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <ListItem key={`not-${idx}`}>
                        <ListItemIcon>
                          <CloseIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          sx={{
                            textDecoration: "line-through",
                            color: "text.disabled",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                  <Button
                    variant={plan.buttonVariant}
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to={
                      plan.id === "free"
                        ? "/register"
                        : plan.id === "enterprise"
                          ? "/contact"
                          : "/register?role=owner"
                    }
                    sx={{ minWidth: 200 }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </PricingCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Comparison Table (Optional) */}
      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3" align="center">
            Compare Features
          </SectionTitle>
          <Paper sx={{ p: 4, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <Divider />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Real-time search</td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Booking management</td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Multiple parkings</td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" /> (up to 5)
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" /> Unlimited
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Staff management</td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Analytics & reports</td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>API access</td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px" }}>Priority support</td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CloseIcon color="error" />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <CheckIcon color="success" />
                  </td>
                </tr>
              </tbody>
            </table>
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Frequently Asked Questions
        </SectionTitle>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {faqs.map((faq, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {faq.q}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.a}
                </Typography>
              </Paper>
            </Grid>
          ))}
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
            Start Your Free Trial Today
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", opacity: 0.95 }}
          >
            No credit card required. Cancel anytime.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{
              backgroundColor: "#fff",
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Pricing;
