// src/pages/Terms.jsx
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

const Terms = () => {
  const theme = useTheme();

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
            Terms & Conditions
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Please read these terms carefully before using ParkPro.
          </Typography>
        </Container>
      </HeroSection>

      {/* Content */}
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

          <SectionTitle variant="h5">1. Acceptance of Terms</SectionTitle>
          <Typography paragraph>
            By accessing or using ParkPro's website, mobile applications, or
            services (collectively, the "Service"), you agree to be bound by
            these Terms & Conditions ("Terms"). If you do not agree to these
            Terms, you may not access or use the Service. These Terms apply to
            all users, including drivers, parking owners, and visitors.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">2. Description of Service</SectionTitle>
          <Typography paragraph>
            ParkPro provides an online platform that connects drivers seeking
            parking spaces with parking space owners. We facilitate the booking,
            payment, and communication between users and parking providers.
            ParkPro is not a parking operator itself but acts as an
            intermediary. The actual parking contract is between the driver and
            the parking owner.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">3. User Accounts</SectionTitle>
          <Typography paragraph>
            To use certain features of the Service, you must register for an
            account. You agree to provide accurate, current, and complete
            information during registration and to update such information to
            keep it accurate, current, and complete. You are responsible for
            safeguarding your password and for all activities that occur under
            your account. You must immediately notify ParkPro of any
            unauthorized use of your account.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">4. Bookings and Payments</SectionTitle>
          <Typography paragraph>
            When you book a parking spot through ParkPro, you agree to pay the
            total price displayed, which includes the parking fee and any
            applicable taxes or service fees. Payment is processed securely
            through our third-party payment processors. Bookings are confirmed
            once payment is successfully processed. All sales are final, but
            cancellations may be eligible for refunds according to the parking
            owner's cancellation policy, which is displayed at the time of
            booking.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">5. Cancellation and Refunds</SectionTitle>
          <Typography paragraph>
            Each parking listing may have its own cancellation policy (e.g.,
            free cancellation up to 24 hours before start, partial refund, or
            non-refundable). The applicable policy is shown during the booking
            process. If you cancel a booking, the refund amount will be
            determined by that policy. ParkPro may, at its sole discretion,
            issue refunds in exceptional circumstances.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">6. User Conduct</SectionTitle>
          <Typography paragraph>
            You agree not to engage in any of the following prohibited
            activities:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              Using the Service for any illegal purpose or in violation of any
              local, state, national, or international law.
            </li>
            <li>
              Harassing, abusing, intimidating, or harming another person.
            </li>
            <li>
              Interfering with or disrupting the Service or servers or networks
              connected to the Service.
            </li>
            <li>
              Attempting to gain unauthorized access to any part of the Service
              or any other accounts.
            </li>
            <li>
              Using automated means, including bots, scrapers, or spiders, to
              access the Service.
            </li>
            <li>
              Impersonating any person or entity or misrepresenting your
              affiliation with a person or entity.
            </li>
            <li>
              Posting or transmitting any spam, chain letters, or unsolicited
              advertising.
            </li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">
            7. Parking Owner Responsibilities
          </SectionTitle>
          <Typography paragraph>
            If you list a parking space on ParkPro, you represent and warrant
            that you have the authority to offer the space and that the listing
            is accurate and not misleading. You are responsible for:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Maintaining accurate availability and pricing.</li>
            <li>Providing a safe and clean parking environment.</li>
            <li>Honoring all bookings made through the platform.</li>
            <li>Complying with all applicable laws and regulations.</li>
            <li>Promptly notifying ParkPro of any disputes or issues.</li>
          </Box>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">8. Intellectual Property</SectionTitle>
          <Typography paragraph>
            The Service and its entire contents, features, and functionality
            (including but not limited to all information, software, text,
            displays, images, video, and audio, and the design, selection, and
            arrangement thereof) are owned by ParkPro, its licensors, or other
            providers of such material and are protected by copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws. You may not reproduce, distribute, modify,
            create derivative works of, publicly display, publicly perform,
            republish, download, store, or transmit any of the material on our
            Service, except as necessary to use the Service for its intended
            purpose.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">9. Limitation of Liability</SectionTitle>
          <Typography paragraph>
            To the fullest extent permitted by applicable law, in no event shall
            ParkPro, its affiliates, directors, employees, or agents be liable
            for any indirect, incidental, special, consequential, or punitive
            damages, including without limitation, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from (i) your use or
            inability to use the Service; (ii) any conduct or content of any
            third party on the Service; (iii) any content obtained from the
            Service; or (iv) unauthorized access, use, or alteration of your
            transmissions or content. In no event shall ParkPro's total
            liability to you exceed the amount you paid to ParkPro during the
            twelve (12) months prior to the event giving rise to the liability.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">10. Indemnification</SectionTitle>
          <Typography paragraph>
            You agree to defend, indemnify, and hold harmless ParkPro, its
            affiliates, licensors, and service providers, and its and their
            respective officers, directors, employees, contractors, agents,
            licensors, suppliers, successors, and assigns from and against any
            claims, liabilities, damages, judgments, awards, losses, costs,
            expenses, or fees (including reasonable attorneys' fees) arising out
            of or relating to your violation of these Terms or your use of the
            Service, including, but not limited to, any use of the Service's
            content, services, and products other than as expressly authorized
            in these Terms or your use of any information obtained from the
            Service.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">11. Termination</SectionTitle>
          <Typography paragraph>
            ParkPro may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever, including without
            limitation if you breach the Terms. Upon termination, your right to
            use the Service will immediately cease.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">12. Governing Law</SectionTitle>
          <Typography paragraph>
            These Terms shall be governed and construed in accordance with the
            laws of the State of California, without regard to its conflict of
            law provisions. Our failure to enforce any right or provision of
            these Terms will not be considered a waiver of those rights. If any
            provision of these Terms is held to be invalid or unenforceable by a
            court, the remaining provisions of these Terms will remain in
            effect.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">13. Changes to Terms</SectionTitle>
          <Typography paragraph>
            ParkPro reserves the right, at its sole discretion, to modify or
            replace these Terms at any time. If a revision is material, we will
            try to provide at least 30 days' notice prior to any new terms
            taking effect. What constitutes a material change will be determined
            at our sole discretion. By continuing to access or use our Service
            after any revisions become effective, you agree to be bound by the
            revised terms.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <SectionTitle variant="h5">14. Contact Information</SectionTitle>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at:
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

export default Terms;
