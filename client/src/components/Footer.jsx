// src/components/Footer.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(6, 0, 2),
  marginTop: "auto",
}));

const FooterLink = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  opacity: 0.8,
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 1,
    color: theme.palette.common.white,
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: "rgba(255,255,255,0.1)",
  margin: theme.spacing(0, 1),
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "translateY(-3px)",
  },
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: theme.palette.common.white,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.7)",
  },
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DirectionsCarIcon
                sx={{ fontSize: 32, mr: 1, color: theme.palette.common.white }}
              />
              <Typography variant="h5" fontWeight={700}>
                ParkPro
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              The smartest way to find, book, and pay for parking. Join
              thousands of happy drivers and parking owners across the city.
            </Typography>
            <Box sx={{ display: "flex", mt: 2 }}>
              <SocialIconButton
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </SocialIconButton>
              <SocialIconButton
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </SocialIconButton>
              <SocialIconButton
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </SocialIconButton>
              <SocialIconButton
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </SocialIconButton>
              <SocialIconButton
                aria-label="YouTube"
                component="a"
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </SocialIconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink component={RouterLink} to="/">
                Home
              </FooterLink>
              <FooterLink component={RouterLink} to="/about">
                About Us
              </FooterLink>
              <FooterLink component={RouterLink} to="/services">
                Services
              </FooterLink>
              <FooterLink component={RouterLink} to="/pricing">
                Pricing
              </FooterLink>
              <FooterLink component={RouterLink} to="/contact">
                Contact
              </FooterLink>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink component={RouterLink} to="/faq">
                FAQ
              </FooterLink>
              <FooterLink component={RouterLink} to="/help">
                Help Center
              </FooterLink>
              <FooterLink component={RouterLink} to="/support">
                Contact Support
              </FooterLink>
              <FooterLink component={RouterLink} to="/careers">
                Careers
              </FooterLink>
              <FooterLink component={RouterLink} to="/blog">
                Blog
              </FooterLink>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink component={RouterLink} to="/terms">
                Terms & Conditions
              </FooterLink>
              <FooterLink component={RouterLink} to="/privacy">
                Privacy Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/cookies">
                Cookie Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/disclaimer">
                Disclaimer
              </FooterLink>
              <FooterLink component={RouterLink} to="/accessibility">
                Accessibility
              </FooterLink>
            </Box>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Contact Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Parking Avenue, City Center, NY 10001
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@parkpro.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (800) 123-4567
                </Typography>
              </Box>
            </Box>

            {/* Newsletter */}
            <Typography variant="body2" gutterBottom sx={{ opacity: 0.8 }}>
              Subscribe for updates and offers.
            </Typography>
            <Box component="form" sx={{ display: "flex", mt: 1 }}>
              <NewsletterInput
                size="small"
                placeholder="Your email"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 20,
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.common.white,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Subscribe
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* App Store Badges */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AppleIcon />}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                  flex: 1,
                }}
                href="#"
              >
                App Store
              </Button>
              <Button
                variant="outlined"
                startIcon={<AndroidIcon />}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                  flex: 1,
                }}
                href="#"
              >
                Google Play
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © {currentYear} ParkPro. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 1, sm: 0 } }}>
            <FooterLink component={RouterLink} to="/privacy" variant="body2">
              Privacy Policy
            </FooterLink>
            <FooterLink component={RouterLink} to="/terms" variant="body2">
              Terms of Use
            </FooterLink>
            <FooterLink component={RouterLink} to="/sitemap" variant="body2">
              Sitemap
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
