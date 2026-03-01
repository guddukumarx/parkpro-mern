// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Rating,
  useTheme,
  Fade,
  Grow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  Zoom,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  Star as StarIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Apple as AppleIcon,
  Android as AndroidIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

// Custom styled components with animations (keep as before)
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#ffffff",
  padding: theme.spacing(12, 2),
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

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const StepCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  height: "100%",
  textAlign: "center",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  height: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  height: "100%",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: "#ffffff",
  padding: theme.spacing(8, 2),
  textAlign: "center",
  borderRadius: theme.shape.borderRadius * 2,
  marginTop: theme.spacing(8),
}));

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  display: "inline-flex",
  padding: theme.spacing(2),
  borderRadius: "50%",
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: "#ffffff",
  marginBottom: theme.spacing(2),
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // for programmatic navigation
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Stats data
  const stats = [
    { icon: <PeopleIcon />, value: "10K+", label: "Happy Users" },
    { icon: <StoreIcon />, value: "500+", label: "Parking Lots" },
    { icon: <CarIcon />, value: "50K+", label: "Bookings Made" },
    { icon: <StarIcon />, value: "4.8★", label: "App Rating" },
  ];

  // How it works steps
  const steps = [
    {
      icon: <SearchIcon />,
      title: "Search",
      description: "Find available parking spots near you in real-time.",
    },
    {
      icon: <BookIcon />,
      title: "Book",
      description: "Reserve your spot instantly with just a few taps.",
    },
    {
      icon: <PaymentIcon />,
      title: "Pay",
      description: "Secure online payment with multiple options.",
    },
    {
      icon: <CheckIcon />,
      title: "Park",
      description: "Scan QR code at entry and enjoy hassle-free parking.",
    },
  ];

  // Features for users
  const userFeatures = [
    {
      icon: <SpeedIcon />,
      title: "Real-Time Availability",
      description: "See live parking spot availability and book instantly.",
    },
    {
      icon: <PaymentIcon />,
      title: "Secure Payments",
      description: "Multiple payment options with end-to-end encryption.",
    },
    {
      icon: <SupportIcon />,
      title: "24/7 Support",
      description: "Our team is always here to help you.",
    },
  ];

  // Features for owners
  const ownerFeatures = [
    {
      icon: <TrendingUpIcon />,
      title: "Maximize Revenue",
      description: "Dynamic pricing and occupancy analytics to boost earnings.",
    },
    {
      icon: <SecurityIcon />,
      title: "Access Control",
      description: "Digital permits and automated entry/exit management.",
    },
    {
      icon: <StoreIcon />,
      title: "Owner Dashboard",
      description: "Manage your lots, view earnings, and track performance.",
    },
  ];

  // Benefits
  const benefits = [
    "Save time by finding parking instantly",
    "Reduce traffic congestion in busy areas",
    "Contactless entry/exit for safety",
    "Eco-friendly – lower emissions by reducing circling",
    "Transparent pricing with no hidden fees",
    "Earn rewards with every booking",
  ];

  // Testimonials array (20 items)
  const testimonials = [
    {
      name: "John Driver",
      avatar: "JD",
      rating: 5,
      comment:
        "ParkPro has made my daily commute so much easier. I always find a spot near my office!",
    },
    {
      name: "Jane Owner",
      avatar: "JO",
      rating: 5,
      comment:
        "As a parking lot owner, ParkPro helped me increase occupancy by 30%. Highly recommended!",
    },
    {
      name: "Mike Johnson",
      avatar: "MJ",
      rating: 4,
      comment:
        "Great app! The real-time availability feature is a lifesaver during peak hours.",
    },
    {
      name: "Sarah Williams",
      avatar: "SW",
      rating: 5,
      comment:
        "I love how easy it is to book parking. No more circling around!",
    },
    {
      name: "David Brown",
      avatar: "DB",
      rating: 4,
      comment:
        "The app is very user-friendly and the payment process is seamless.",
    },
    {
      name: "Emily Davis",
      avatar: "ED",
      rating: 5,
      comment:
        "Excellent customer support! They resolved my issue within minutes.",
    },
    {
      name: "Michael Wilson",
      avatar: "MW",
      rating: 5,
      comment:
        "I've recommended ParkPro to all my friends. It's a game changer.",
    },
    {
      name: "Lisa Martinez",
      avatar: "LM",
      rating: 4,
      comment:
        "The map view helps me find parking in unfamiliar areas quickly.",
    },
    {
      name: "Robert Taylor",
      avatar: "RT",
      rating: 5,
      comment: "Great for event parking! Booked in advance and saved money.",
    },
    {
      name: "Jennifer Anderson",
      avatar: "JA",
      rating: 5,
      comment: "Very reliable. Never had an issue with my bookings.",
    },
    {
      name: "William Thomas",
      avatar: "WT",
      rating: 4,
      comment: "Good app but would love to see more payment options.",
    },
    {
      name: "Patricia Jackson",
      avatar: "PJ",
      rating: 5,
      comment: "The rewards program is fantastic! I've saved so much.",
    },
    {
      name: "James White",
      avatar: "JW",
      rating: 5,
      comment: "Easy to use and saves me time every day.",
    },
    {
      name: "Barbara Harris",
      avatar: "BH",
      rating: 4,
      comment: "Occasional glitches but overall a solid app.",
    },
    {
      name: "Charles Martin",
      avatar: "CM",
      rating: 5,
      comment: "Best parking app I've ever used. Highly recommended!",
    },
    {
      name: "Linda Thompson",
      avatar: "LT",
      rating: 5,
      comment: "The app is intuitive and the booking process is quick.",
    },
    {
      name: "Joseph Garcia",
      avatar: "JG",
      rating: 4,
      comment: "Good selection of parking lots in my city.",
    },
    {
      name: "Elizabeth Robinson",
      avatar: "ER",
      rating: 5,
      comment: "Love the live availability feature!",
    },
    {
      name: "Thomas Clark",
      avatar: "TC",
      rating: 5,
      comment: "Perfect for daily commuters. Highly recommend.",
    },
    {
      name: "Susan Lewis",
      avatar: "SL",
      rating: 5,
      comment: "ParkPro has simplified parking for me completely.",
    },
  ];

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      setSnackbar({
        open: true,
        message: `Searching parking in ${location}...`,
        severity: "info",
      });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSnackbar({
        open: true,
        message: "Subscribed to newsletter!",
        severity: "success",
      });
      setEmail("");
    }
  };

  const handleBookNow = () => {
    navigate("/user/book-slot");
  };

  const handlePartnerWithUs = () => {
    navigate("/register?role=owner");
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5" }}>
      {/* Floating Action Button */}
      <Zoom in timeout={1000}>
        <Fab
          color="primary"
          aria-label="book"
          onClick={handleBookNow}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
        >
          <CarIcon />
        </Fab>
      </Zoom>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      fontWeight: 800,
                      mb: 2,
                      color: "#ffffff",
                    }}
                  >
                    Smart Parking for a Smarter City
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mb: 4, color: "#ffffff", opacity: 0.95 }}
                  >
                    Find, book, and pay for parking instantly. No more circling
                    the block. Join thousands of happy drivers.
                  </Typography>

                  {/* Quick Search Bar */}
                  <Paper
                    component="form"
                    onSubmit={handleLocationSearch}
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: 500,
                      mb: 3,
                    }}
                  >
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <LocationIcon color="primary" />
                    </InputAdornment>
                    <TextField
                      placeholder="Enter location or landmark"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ ml: 1, flex: 1 }}
                    />
                    <IconButton
                      type="submit"
                      sx={{ p: "10px" }}
                      color="primary"
                    >
                      <SearchIcon />
                    </IconButton>
                  </Paper>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CarIcon />}
                      onClick={handleBookNow}
                      sx={{
                        backgroundColor: "#ffffff",
                        color: theme.palette.primary.main,
                        px: 4,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      Book a Slot
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<StoreIcon />}
                      onClick={handlePartnerWithUs}
                      sx={{
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        px: 4,
                        py: 1.5,
                        "&:hover": {
                          borderColor: "#ffffff",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      List Your Parking
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <ParkingIcon sx={{ fontSize: 120, color: "#ffffff" }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in timeout={500 + index * 200}>
                <StatCard elevation={2}>
                  <IconWrapper bgcolor={theme.palette.primary.main}>
                    {stat.icon}
                  </IconWrapper>
                  <Typography variant="h4" fontWeight={700} color="#333333">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="#666666">
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: "#333333", fontWeight: 700 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#666666", mb: 6, maxWidth: 700, mx: "auto" }}
          >
            Four simple steps to hassle-free parking
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StepCard>
                  <IconWrapper bgcolor={theme.palette.primary.main}>
                    {step.icon}
                  </IconWrapper>
                  <Typography variant="h5" gutterBottom color="#333333">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="#666666">
                    {step.description}
                  </Typography>
                </StepCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#333333", fontWeight: 700 }}
        >
          Designed for Everyone
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#666666", mb: 6, maxWidth: 700, mx: "auto" }}
        >
          Whether you're a driver or a parking owner, ParkPro has you covered.
        </Typography>

        <Grid container spacing={4}>
          {/* For Users */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#333333" }}>
                For Drivers
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {userFeatures.map((feature, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <FeatureCard>
                    <IconWrapper bgcolor={theme.palette.primary.main}>
                      {feature.icon}
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom color="#333333">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="#666666">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* For Owners */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#333333" }}>
                For Parking Owners
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {ownerFeatures.map((feature, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <FeatureCard>
                    <IconWrapper bgcolor={theme.palette.secondary.main}>
                      {feature.icon}
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom color="#333333">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="#666666">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Map Preview Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: "#333333", fontWeight: 700 }}
          >
            Find Parking Anywhere
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#666666", mb: 6, maxWidth: 700, mx: "auto" }}
          >
            Our interactive map shows real-time availability in your city.
          </Typography>
          <Paper
            sx={{
              height: 400,
              backgroundColor: theme.palette.grey[200],
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "url('/map-placeholder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Typography variant="h6" color="#333333">
              Interactive Map Preview
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: "#333333", fontWeight: 700 }}
          >
            Why Choose ParkPro?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body1" color="#333333">
                    {benefit}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Carousel */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#333333", fontWeight: 700 }}
        >
          What Our Users Say
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#666666", mb: 4, maxWidth: 700, mx: "auto" }}
        >
          Join thousands of satisfied customers
        </Typography>

        <Box sx={{ mx: "auto", maxWidth: "100%" }}>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ px: 1 }}>
                <Card sx={{ height: "100%", p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="#333333"
                        fontWeight={600}
                      >
                        {testimonial.name}
                      </Typography>
                      <Rating
                        value={testimonial.rating}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="#666666"
                    sx={{ fontStyle: "italic" }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>

      {/* Download App Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ color: "#333333", fontWeight: 700 }}
              >
                Download Our App
              </Typography>
              <Typography variant="body1" color="#666666" sx={{ mb: 4 }}>
                Get the full ParkPro experience on your mobile device. Book,
                pay, and manage your parking on the go.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AppleIcon />}
                  sx={{ backgroundColor: "#000", color: "#fff" }}
                >
                  App Store
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AndroidIcon />}
                  sx={{ backgroundColor: "#3DDC84", color: "#000" }}
                >
                  Google Play
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 300,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">App Preview</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Signup */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#333333", fontWeight: 700 }}
          >
            Stay Updated
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#333333" }}>
            Subscribe to our newsletter for exclusive offers and updates.
          </Typography>
          <Box
            component="form"
            onSubmit={handleNewsletterSubmit}
            sx={{ display: "flex", gap: 1, maxWidth: 400, mx: "auto" }}
          >
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
            <Button type="submit" variant="contained" color="secondary">
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Social Media Links */}
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="#666666" gutterBottom>
          Follow us on social media
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <IconButton
            href="https://facebook.com"
            target="_blank"
            color="primary"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="https://twitter.com"
            target="_blank"
            color="primary"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            href="https://instagram.com"
            target="_blank"
            color="primary"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            color="primary"
          >
            <LinkedInIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <CTASection>
          <Typography
            variant="h3"
            gutterBottom
            fontWeight={700}
            sx={{ color: "#ffffff" }}
          >
            Ready to Simplify Your Parking?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: "#ffffff", opacity: 0.95 }}
          >
            Join thousands of satisfied users. Start your free trial today.
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
              startIcon={<CarIcon />}
              onClick={handleBookNow}
              sx={{
                backgroundColor: "#ffffff",
                color: theme.palette.secondary.main,
                px: 4,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Book Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<StoreIcon />}
              onClick={handlePartnerWithUs}
              sx={{
                color: "#ffffff",
                borderColor: "#ffffff",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Partner With Us
            </Button>
          </Box>
        </CTASection>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
