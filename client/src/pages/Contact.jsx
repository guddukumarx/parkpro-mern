// src/pages/Contact.jsx (corrected with all imports)
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  useTheme,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon,
  Person as PersonIcon, // ✅ Added missing PersonIcon
} from "@mui/icons-material";
import contactService from "../services/contactService";

// ... (rest of the code remains same)

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#fff",
  padding: theme.spacing(15, 2),
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

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
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
  transition: "transform 0.3s ease",
  "& svg": {
    fontSize: 30,
  },
}));

const StyledForm = styled(Box)(({ theme }) => ({
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(2),
  },
}));

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await contactService.sendMessage(formData);
      setSnackbar({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to send message. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: "Visit Us",
      details: "123 Parking Avenue, City Center, NY 10001",
      color: theme.palette.primary.main,
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      details: "+1 (800) 123-4567",
      color: theme.palette.secondary.main,
    },
    {
      icon: <EmailIcon />,
      title: "Email Us",
      details: "support@parkpro.com",
      color: theme.palette.success.main,
    },
    {
      icon: <TimeIcon />,
      title: "Working Hours",
      details: "Mon-Fri: 9AM - 6PM",
      color: theme.palette.info.main,
    },
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
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Get in Touch
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            We're here to help and answer any questions you might have.
          </Typography>
        </Container>
      </HeroSection>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {contactInfo.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <InfoCard elevation={2}>
                <IconWrapper color={item.color}>{item.icon}</IconWrapper>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.details}
                </Typography>
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Map Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper
          sx={{
            height: 400,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: theme.shadows[4],
          }}
        >
          <iframe
            title="ParkPro Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-73.98510868405913!3d40.75889697932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Paper>
      </Container>

      {/* Contact Form & Additional Info */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: theme.shadows[3] }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Send us a Message
              </Typography>
              <StyledForm component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </StyledForm>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 3,
                boxShadow: theme.shadows[3],
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Have questions? Our team is ready to help you. Whether you're a
                driver or a parking owner, we're here to assist.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Follow Us
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#1877F2" }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#1DA1F2" }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#E4405F" }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#0A66C2" }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Email:</strong> support@parkpro.com
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Phone:</strong> +1 (800) 123-4567
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Address:</strong> 123 Parking Avenue, City Center, NY
                10001
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
