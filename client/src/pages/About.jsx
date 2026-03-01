// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  useTheme,
  Divider,
  Button,
  Chip,
  Tabs,
  Tab,
  Rating,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  EmojiEmotions as MissionIcon,
  Visibility as VisionIcon,
  TrendingUp as GrowthIcon,
  People as TeamIcon, // ✅ Fixed: renamed to TeamIcon for stats
  LocalParking as ParkingIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Timeline as TimelineIcon,
  MilitaryTech as AwardIcon,
  Business as PartnerIcon,
  RocketLaunch as RocketIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon, // ✅ Added EmailIcon
} from "@mui/icons-material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { Link as RouterLink } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Styled components (same as before)
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
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "30%",
    height: "30%",
    background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
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

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const TeamCard = styled(Card)(({ theme }) => ({
  height: "100%",
  textAlign: "center",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const ValueCard = styled(Card)(({ theme }) => ({
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

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: "inline-flex",
  padding: theme.spacing(2),
  borderRadius: "50%",
  backgroundColor: color || theme.palette.primary.main,
  color: "#fff",
  marginBottom: theme.spacing(2),
}));

const StyledTimelineDot = styled(TimelineDot)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
}));

const PartnerLogo = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 100,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

const About = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Company stats (✅ fixed: used TeamIcon instead of PeopleIcon)
  const stats = [
    { value: 10000, label: "Happy Users", icon: <TeamIcon />, suffix: "+" },
    { value: 500, label: "Parking Lots", icon: <ParkingIcon />, suffix: "+" },
    { value: 50000, label: "Bookings", icon: <GrowthIcon />, suffix: "+" },
    {
      value: 4.8,
      label: "User Rating",
      icon: <StarIcon />,
      suffix: "",
      decimals: 1,
    },
  ];

  // Timeline data
  const timelineData = [
    {
      year: "2020",
      title: "ParkPro Founded",
      description: "Started with a vision to simplify parking.",
    },
    {
      year: "2021",
      title: "First 100 Lots",
      description: "Onboarded 100 parking lots across the city.",
    },
    {
      year: "2022",
      title: "10,000 Users",
      description: "Reached 10,000 active users milestone.",
    },
    {
      year: "2023",
      title: "Mobile App Launch",
      description: "Launched iOS and Android apps.",
    },
    {
      year: "2024",
      title: "Smart Pricing",
      description: "Introduced AI-based dynamic pricing.",
    },
  ];

  // Team members
  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      avatar: "JS",
      bio: "Former parking industry executive with 15 years of experience.",
      social: { linkedin: "#", twitter: "#", email: "john@parkpro.com" },
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      avatar: "SJ",
      bio: "Tech innovator passionate about smart city solutions.",
      social: { linkedin: "#", github: "#", email: "sarah@parkpro.com" },
    },
    {
      name: "Mike Chen",
      role: "Head of Operations",
      avatar: "MC",
      bio: "Ensures smooth operations and partner satisfaction.",
      social: { linkedin: "#", twitter: "#", email: "mike@parkpro.com" },
    },
    {
      name: "Emily Davis",
      role: "Customer Success",
      avatar: "ED",
      bio: "Dedicated to providing top-notch support to users.",
      social: { linkedin: "#", email: "emily@parkpro.com" },
    },
  ];

  // Core values
  const values = [
    {
      icon: <MissionIcon />,
      title: "Mission",
      description:
        "To revolutionize urban parking by making it effortless, accessible, and stress-free for everyone.",
    },
    {
      icon: <VisionIcon />,
      title: "Vision",
      description:
        "A world where finding parking is as easy as booking a ride.",
    },
    {
      icon: <CheckIcon />,
      title: "Integrity",
      description:
        "We operate with transparency and honesty in everything we do.",
    },
    {
      icon: <TeamIcon />, // Using TeamIcon for Community
      title: "Community",
      description:
        "Building a community of drivers and parking owners working together.",
    },
  ];

  // Awards
  const awards = [
    { year: "2023", title: "Best Parking App", organization: "Tech Awards" },
    {
      year: "2022",
      title: "Innovation in Mobility",
      organization: "Urban Summit",
    },
    {
      year: "2021",
      title: "Startup of the Year",
      organization: "Local Business Awards",
    },
  ];

  // Partners
  const partners = [
    { name: "City Parking Authority", logo: "/logos/city.png" },
    { name: "GreenTech Solutions", logo: "/logos/greentech.png" },
    { name: "Parking Network", logo: "/logos/network.png" },
    { name: "Mobility Plus", logo: "/logos/mobility.png" },
    { name: "EcoPark", logo: "/logos/ecopark.png" },
    { name: "Smart City Initiative", logo: "/logos/smartcity.png" },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
              animation: "fadeInUp 1s ease",
            }}
          >
            About ParkPro
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              mb: 4,
              animation: "fadeInUp 1.2s ease",
            }}
          >
            We're on a mission to make parking smarter, faster, and more
            convenient for everyone.
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
              animation: "fadeInUp 1.4s ease",
            }}
          >
            Get in Touch
          </Button>
        </Container>
      </HeroSection>
      {/* Mission & Vision Tabs */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                label="Our Mission"
                icon={<MissionIcon />}
                iconPosition="start"
              />
              <Tab
                label="Our Vision"
                icon={<VisionIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Our mission is to eliminate parking stress by connecting
                  drivers with available spots in real-time, using cutting-edge
                  technology to optimize urban mobility. We strive to create a
                  seamless experience for both drivers and parking owners,
                  reducing congestion and carbon footprint.
                </Typography>
              )}
              {tabValue === 1 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ fontSize: "1.1rem" }}
                >
                  We envision a future where parking is no longer a hassle –
                  where every parking space is utilized efficiently, and drivers
                  can effortlessly find and book spots through our intelligent
                  platform. We aim to be the global standard for smart parking
                  solutions.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 8 }} ref={ref}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatCard elevation={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <IconWrapper
                      color={theme.palette.primary.main}
                      sx={{ mb: 2 }}
                    >
                      {stat.icon}
                    </IconWrapper>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      align="center"
                      sx={{ width: "100%" }}
                    >
                      {inView ? (
                        <CountUp
                          start={0}
                          end={stat.value}
                          duration={2}
                          separator=","
                          suffix={stat.suffix}
                          decimals={stat.decimals || 0}
                        />
                      ) : (
                        "0"
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ width: "100%" }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Timeline Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Our Journey
        </SectionTitle>
        <Timeline position="alternate">
          {timelineData.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <StyledTimelineDot color="primary">
                  <TimelineIcon />
                </StyledTimelineDot>
                {index < timelineData.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Typography variant="h6" color="primary">
                    {item.year}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
      {/* Core Values */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3" align="center">
            Our Core Values
          </SectionTitle>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ValueCard>
                  <IconWrapper color={theme.palette.primary.main}>
                    {value.icon}
                  </IconWrapper>
                  <Typography variant="h5" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </ValueCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Awards & Recognition */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Awards & Recognition
        </SectionTitle>
        <Grid container spacing={4} justifyContent="center">
          {awards.map((award, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 3 }}>
                <IconWrapper color={theme.palette.secondary.main}>
                  <AwardIcon />
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  {award.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {award.organization}
                </Typography>
                <Chip label={award.year} size="small" color="primary" />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Partners */}
      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3" align="center">
            Our Partners
          </SectionTitle>
          <Grid container spacing={4} justifyContent="center">
            {partners.map((partner, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <PartnerLogo>
                  <Typography variant="body2" color="text.secondary">
                    {partner.name}
                  </Typography>
                  {/* Replace with actual image: <img src={partner.logo} alt={partner.name} style={{ maxWidth: '100%', maxHeight: 60 }} /> */}
                </PartnerLogo>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" align="center">
          Meet Our Team
        </SectionTitle>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TeamCard>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 2,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "2rem",
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {member.bio}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  {member.social.linkedin && (
                    <IconButton
                      size="small"
                      href={member.social.linkedin}
                      target="_blank"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {member.social.twitter && (
                    <IconButton
                      size="small"
                      href={member.social.twitter}
                      target="_blank"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {member.social.email && (
                    <IconButton
                      size="small"
                      href={`mailto:${member.social.email}`}
                    >
                      <EmailIcon />{" "}
                      {/* ✅ Fixed: used EmailIcon instead of InstagramIcon */}
                    </IconButton>
                  )}
                </Box>
              </TeamCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
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
            Join the ParkPro Community
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", opacity: 0.95 }}
          >
            Whether you're a driver looking for hassle-free parking or an owner
            wanting to maximize your lot, we're here to help. Get started today!
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
              sx={{
                color: "#fff",
                borderColor: "#fff",
                px: 4,
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              List Your Parking
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
