// src/pages/Accessibility.jsx
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
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

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

const Accessibility = () => {
  const theme = useTheme();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <AccessibilityNewIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Accessibility Statement
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            Our commitment to inclusivity and accessibility for all users.
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

          <SectionTitle variant="h5">Our Commitment</SectionTitle>
          <Typography paragraph>
            ParkPro is committed to ensuring digital accessibility for people
            with disabilities. We are continually improving the user experience
            for everyone and applying the relevant accessibility standards to
            ensure we provide equal access to all users.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Accessibility Standards</SectionTitle>
          <Typography paragraph>
            We strive to conform to the Web Content Accessibility Guidelines
            (WCAG) 2.1 Level AA. These guidelines outline how to make web
            content more accessible for people with disabilities, including
            blindness and low vision, deafness and hearing loss, learning
            disabilities, cognitive limitations, limited movement, speech
            disabilities, photosensitivity, and combinations of these.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">
            Measures to Support Accessibility
          </SectionTitle>
          <Typography paragraph>
            ParkPro takes the following measures to ensure accessibility:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Include accessibility as part of our mission statement.</li>
            <li>Integrate accessibility into our procurement practices.</li>
            <li>Provide continual accessibility training for our staff.</li>
            <li>Assign clear accessibility goals and responsibilities.</li>
            <li>Employ formal accessibility quality assurance methods.</li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Conformance Status</SectionTitle>
          <Typography paragraph>
            The Web Content Accessibility Guidelines (WCAG) defines requirements
            for designers and developers to improve accessibility for people
            with disabilities. It defines three levels of conformance: Level A,
            Level AA, and Level AAA. ParkPro is partially conformant with WCAG
            2.1 level AA. Partially conformant means that some parts of the
            content do not fully conform to the accessibility standard.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Feedback</SectionTitle>
          <Typography paragraph>
            We welcome your feedback on the accessibility of ParkPro. Please let
            us know if you encounter accessibility barriers:
          </Typography>
          <Typography>
            <strong>Email:</strong> accessibility@parkpro.com
            <br />
            <strong>Phone:</strong> +1 (800) 123-4567
            <br />
            We try to respond to feedback within 2 business days.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Technical Specifications</SectionTitle>
          <Typography paragraph>
            Accessibility of ParkPro relies on the following technologies to
            work with the particular combination of web browser and any
            assistive technologies or plugins installed on your computer:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </Box>
          <Typography paragraph>
            These technologies are relied upon for conformance with the
            accessibility standards used.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Limitations and Alternatives</SectionTitle>
          <Typography paragraph>
            Despite our best efforts to ensure accessibility of ParkPro, there
            may be some limitations. Below is a description of known
            limitations, and potential solutions. Please contact us if you
            observe an issue not listed below.
          </Typography>
          <Typography paragraph>
            <strong>Known limitations:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <strong>Third-party components:</strong> Some third-party
              integrations may not fully conform to accessibility standards. We
              are working with vendors to address these issues.
            </li>
            <li>
              <strong>Older PDF documents:</strong> Some of our older PDF
              documents may not be fully accessible. You can request an
              accessible version by contacting us.
            </li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Assessment Approach</SectionTitle>
          <Typography paragraph>
            ParkPro assessed the accessibility of its website by the following
            approaches:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Self-evaluation</li>
            <li>External evaluation</li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">Formal Complaints</SectionTitle>
          <Typography paragraph>
            If you wish to file a formal complaint, please contact us at
            legal@parkpro.com. We aim to resolve all complaints within 30 days.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Accessibility;
