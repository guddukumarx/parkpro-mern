// src/pages/Cookies.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CookieIcon from "@mui/icons-material/Cookie";

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
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const Cookies = () => {
  const theme = useTheme();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <CookieIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Cookie Policy
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            How we use cookies and similar technologies.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>

          <SectionTitle variant="h5">What Are Cookies?</SectionTitle>
          <Typography paragraph>
            Cookies are small text files that are placed on your device
            (computer, tablet, or mobile) when you visit a website. They are
            widely used to make websites work more efficiently and provide
            information to the website owners. Cookies help us enhance your
            browsing experience, remember your preferences, and understand how
            you use our services.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">How We Use Cookies</SectionTitle>
          <Typography paragraph>
            ParkPro uses cookies for the following purposes:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function properly. They enable you to navigate our site and use
              its features, such as accessing secure areas and making bookings.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Collect anonymous
              information about how visitors use our website, such as which
              pages are most popular. This helps us improve the performance and
              design of our site.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> Remember choices you make
              (such as your language or region) to provide enhanced,
              personalized features.
            </li>
            <li>
              <strong>Targeting/Advertising Cookies:</strong> Used to deliver
              relevant ads to you and measure the effectiveness of our marketing
              campaigns. They may be placed by third-party advertising networks
              with our permission.
            </li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Third-Party Cookies</SectionTitle>
          <Typography paragraph>
            Some cookies are placed by third-party services that appear on our
            pages. For example, we may use analytics providers (like Google
            Analytics) to help us understand how visitors engage with our site.
            These third parties may use cookies to collect information about
            your online activities over time and across different websites.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Managing Cookies</SectionTitle>
          <Typography paragraph>
            Most web browsers allow you to control cookies through their
            settings. You can choose to accept or reject cookies, or set your
            browser to notify you when a cookie is sent. Please note that if you
            disable cookies, some features of ParkPro may not function properly
            and your experience may be degraded.
          </Typography>
          <Typography paragraph>
            To learn more about how to manage cookies in popular browsers, visit
            the following links:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/en-us/HT201265"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                Internet Explorer/Edge
              </a>
            </li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Changes to This Policy</SectionTitle>
          <Typography paragraph>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legislation, or our practices. When we make
            material changes, we will notify you by posting the updated policy
            on our website and updating the "Last Updated" date at the top. We
            encourage you to review this policy periodically.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Contact Us</SectionTitle>
          <Typography paragraph>
            If you have any questions about our use of cookies, please contact
            us at:
          </Typography>
          <Typography>
            <strong>Email:</strong> privacy@parkpro.com
            <br />
            <strong>Address:</strong> 123 Parking Avenue, Suite 400, San
            Francisco, CA 94105
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Cookies;
