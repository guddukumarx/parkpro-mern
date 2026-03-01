// src/pages/user/Support.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const SupportPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const Support = () => {
  const theme = useTheme();

  // FAQ data
  const faqs = [
    {
      question: 'How do I book a parking slot?',
      answer: 'Go to the home page, search for your desired location, select a slot, choose date and time, and proceed to payment.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking from the "My Bookings" page. Cancellation policy may apply.'
    },
    {
      question: 'How do I get a refund?',
      answer: 'Refunds are processed automatically for cancellations within the policy period. Contact support if you face issues.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, PayPal, and Apple Pay.'
    },
    {
      question: 'How do I contact the parking owner?',
      answer: 'You can contact the owner through the booking details page after your booking is confirmed.'
    },
  ];

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simulate API call (replace with actual support ticket endpoint)
    try {
      // Here you would call your backend API to send support request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Help & Support
      </Typography>

      {/* FAQ Section */}
      <SupportPaper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HelpOutlineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h5">Frequently Asked Questions</Typography>
        </Box>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </SupportPaper>

      {/* Contact Form */}
      <SupportPaper>
        <Typography variant="h5" gutterBottom>Contact Support</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your message has been sent. We'll reply to your email shortly.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SupportPaper>

      {/* Alternative contact info */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Or email us directly at <a href="mailto:support@parkpro.com">support@parkpro.com</a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Call us: +1 (800) 123-4567
        </Typography>
      </Box>
    </Container>
  );
};

export default Support;