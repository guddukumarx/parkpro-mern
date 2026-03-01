// src/pages/FAQ.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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

const FAQ = () => {
  const theme = useTheme();

  const faqs = [
    {
      question: "What is ParkPro?",
      answer:
        "ParkPro is a smart parking platform that allows drivers to find, book, and pay for parking spots in real-time, and enables parking owners to manage their lots efficiently.",
    },
    {
      question: "How do I book a parking spot?",
      answer:
        "Simply search for your desired location, select a date and time, choose an available slot, and complete the payment. You will receive a confirmation email with all details.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        'Yes, you can cancel your booking from the "My Bookings" page. Cancellation policies vary by parking owner, so please check the policy before booking.',
    },
    {
      question: "How do I get a refund?",
      answer:
        "Refunds are processed automatically based on the cancellation policy. If eligible, the amount will be refunded to your original payment method within 5-7 business days.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, all payments are processed through secure, PCI-compliant third-party payment gateways. We do not store your payment details.",
    },
    {
      question: "How do I list my parking lot?",
      answer:
        'Register as an owner, then go to "My Parkings" and click "Add New Parking". Fill in the details and submit. Your listing will be reviewed by our team.',
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach us via the Contact page, email us at support@parkpro.com, or call +1 (800) 123-4567.",
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <HelpOutlineIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            Find answers to common questions about ParkPro.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight={500}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQ;
