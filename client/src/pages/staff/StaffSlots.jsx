import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
} from '@mui/material';
import staffService from '../../services/staffService';

const StaffSlots = () => {
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await staffService.getDashboard();
      setParkings(res.data.parkings);
      if (res.data.parkings.length > 0) setSelectedParking(res.data.parkings[0]._id);
    } catch (err) {
      setError(err.message || 'Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParking) fetchSlots();
  }, [selectedParking]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await staffService.getParkingSlots(selectedParking);
      setSlots(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await staffService.updateSlotStatus(slotId, newStatus);
      // Refresh slots
      fetchSlots();
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  if (loading) return <Container><Skeleton variant="rectangular" height={400} /></Container>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Slots</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Parking</InputLabel>
        <Select value={selectedParking} label="Select Parking" onChange={(e) => setSelectedParking(e.target.value)}>
          {parkings.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {slots.map(slot => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={slot._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{slot.slotNumber}</Typography>
                <Typography>Type: {slot.type}</Typography>
                <Typography>Price: ${slot.pricePerHour}/hr</Typography>
                <Chip label={slot.status} color={slot.status === 'available' ? 'success' : 'default'} />
              </CardContent>
              <CardActions>
                {slot.status === 'available' && (
                  <Button size="small" onClick={() => handleStatusChange(slot._id, 'booked')}>Check-in</Button>
                )}
                {slot.status === 'booked' && (
                  <Button size="small" onClick={() => handleStatusChange(slot._id, 'available')}>Check-out</Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StaffSlots;