// src/pages/Help.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  HelpOutline as HelpIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  SupportAgent as SupportIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

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

const HelpCard = styled(Card)(({ theme }) => ({
  height: "100%",
  textAlign: "center",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const Help = () => {
  const theme = useTheme();

  const helpTopics = [
    {
      icon: <AccountIcon />,
      title: "Account & Profile",
      description: "Manage your account, login issues, profile settings.",
      link: "/faq#account",
    },
    {
      icon: <PaymentIcon />,
      title: "Payments & Billing",
      description: "Payment methods, invoices, refunds.",
      link: "/faq#payments",
    },
    {
      icon: <BuildIcon />,
      title: "Technical Support",
      description: "App issues, bugs, troubleshooting.",
      link: "/faq#tech",
    },
    {
      icon: <ArticleIcon />,
      title: "Guides & Tutorials",
      description: "How to book, list parking, use features.",
      link: "/faq#guides",
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <SupportIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Help Center
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            How can we help you today?
          </Typography>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <SearchIcon color="primary" />
            </InputAdornment>
            <TextField
              placeholder="Search for answers..."
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, flex: 1 }}
            />
            <Button type="submit" sx={{ p: "10px" }} color="primary">
              Search
            </Button>
          </Paper>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
          Browse by Topic
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {helpTopics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <HelpCard>
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 48,
                    mb: 2,
                  }}
                >
                  {topic.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {topic.description}
                </Typography>
                <Button component={RouterLink} to={topic.link} color="primary">
                  Learn More
                </Button>
              </HelpCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Still need help?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Can't find what you're looking for? Our support team is here to
                help.
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/contact"
                sx={{ mt: 2 }}
              >
                Contact Support
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Popular Articles
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>
                  <Typography
                    component={RouterLink}
                    to="/faq#booking"
                    color="primary"
                  >
                    How to book a parking spot
                  </Typography>
                </li>
                <li>
                  <Typography
                    component={RouterLink}
                    to="/faq#cancel"
                    color="primary"
                  >
                    Cancellation and refund policy
                  </Typography>
                </li>
                <li>
                  <Typography
                    component={RouterLink}
                    to="/faq#owner"
                    color="primary"
                  >
                    Listing your parking lot
                  </Typography>
                </li>
                <li>
                  <Typography
                    component={RouterLink}
                    to="/faq#payment"
                    color="primary"
                  >
                    Payment methods accepted
                  </Typography>
                </li>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Help;
