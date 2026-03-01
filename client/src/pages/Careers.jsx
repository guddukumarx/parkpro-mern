// src/pages/Careers.jsx
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Send as SendIcon,
} from "@mui/icons-material";

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

const JobCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const Careers = () => {
  const theme = useTheme();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyDialog, setApplyDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample job openings
  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      description:
        "We are looking for an experienced Full Stack Developer to join our growing team. You will work on both frontend and backend components of our parking platform.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Experience with MongoDB and Express",
        "Strong problem-solving skills",
        "Team player with good communication",
      ],
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $130k",
      description:
        "Lead the development of new features and improvements for ParkPro. Work closely with engineering, design, and marketing teams.",
      requirements: [
        "3+ years of product management experience",
        "Experience with agile methodologies",
        "Strong analytical and communication skills",
        "Background in SaaS or marketplace products",
      ],
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Support",
      location: "New York, NY",
      type: "Full-time",
      salary: "$60k - $80k",
      description:
        "Help our customers get the most out of ParkPro. Handle inquiries, provide training, and ensure customer satisfaction.",
      requirements: [
        "2+ years in customer support or success roles",
        "Excellent communication skills",
        "Problem-solving attitude",
        "Experience with CRM tools",
      ],
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      salary: "$40k - $50k",
      description:
        "Assist in creating marketing campaigns, content creation, and social media management.",
      requirements: [
        "1-2 years of marketing experience",
        "Knowledge of social media platforms",
        "Creative mindset",
        "Basic design skills",
      ],
    },
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplyDialog(true);
  };

  const handleSubmit = () => {
    // In real app, send data to backend
    setSnackbar({
      open: true,
      message: "Application submitted! We'll be in touch.",
      severity: "success",
    });
    setApplyDialog(false);
    setFormData({ name: "", email: "", phone: "", resume: "" });
  };

  return (
    <Box>
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
            Join the ParkPro Team
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Build the future of parking with us. We're looking for passionate
            people to help us revolutionize urban mobility.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Open Positions
        </SectionTitle>
        <Grid container spacing={4}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <JobCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {job.title}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    <Chip
                      icon={<BusinessIcon />}
                      label={job.department}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocationIcon />}
                      label={job.location}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<TimeIcon />}
                      label={job.type}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<MoneyIcon />}
                      label={job.salary}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {job.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Requirements:
                  </Typography>
                  <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{req}</Typography>
                      </li>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </JobCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Application Dialog */}
      <Dialog
        open={applyDialog}
        onClose={() => setApplyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume Link (Google Drive, Dropbox, etc.)"
                value={formData.resume}
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.value })
                }
                required
                helperText="Please provide a link to your resume/CV"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            endIcon={<SendIcon />}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Careers;
