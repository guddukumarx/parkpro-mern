// src/pages/Disclaimer.jsx
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
import WarningIcon from "@mui/icons-material/Warning";

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

const Disclaimer = () => {
  const theme = useTheme();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <WarningIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Disclaimer
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            Important legal information about our services.
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

          <SectionTitle variant="h5">No Warranty</SectionTitle>
          <Typography paragraph>
            The information and services provided by ParkPro are on an "as is"
            and "as available" basis. ParkPro makes no representations or
            warranties of any kind, express or implied, as to the operation of
            the services, or the information, content, materials, or products
            included. You expressly agree that your use of the services is at
            your sole risk.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Limitation of Liability</SectionTitle>
          <Typography paragraph>
            ParkPro shall not be liable for any damages arising from the use of
            or inability to use the services, including but not limited to
            direct, indirect, incidental, punitive, and consequential damages.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Third-Party Links</SectionTitle>
          <Typography paragraph>
            ParkPro may contain links to third-party websites that are not owned
            or controlled by ParkPro. ParkPro has no control over, and assumes
            no responsibility for, the content, privacy policies, or practices
            of any third-party websites. You further acknowledge and agree that
            ParkPro shall not be responsible or liable, directly or indirectly,
            for any damage or loss caused or alleged to be caused by or in
            connection with the use of or reliance on any such content, goods,
            or services available on or through any such websites.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Accuracy of Information</SectionTitle>
          <Typography paragraph>
            While we strive to keep the information on our site accurate and
            up-to-date, ParkPro makes no guarantees about the completeness,
            reliability, or accuracy of this information. Any action you take
            upon the information on this website is strictly at your own risk,
            and ParkPro will not be liable for any losses and damages in
            connection with the use of our website.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Changes to Disclaimer</SectionTitle>
          <Typography paragraph>
            We reserve the right to modify this disclaimer at any time. Changes
            and clarifications will take effect immediately upon their posting
            on the website. If we make material changes to this disclaimer, we
            will notify you here that it has been updated.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Contact Information</SectionTitle>
          <Typography paragraph>
            If you have any questions about this disclaimer, please contact us
            at:
          </Typography>
          <Typography>
            <strong>Email:</strong> legal@parkpro.com
            <br />
            <strong>Address:</strong> 123 Parking Avenue, Suite 400, San
            Francisco, CA 94105
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Disclaimer;
