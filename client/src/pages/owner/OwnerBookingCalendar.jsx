import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Paper,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

const OwnerBookingCalendar = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('dayGridMonth'); // month, week, day

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.fetchOwnerBookings({ limit: 1000 }); // get all for calendar
      const allBookings = res.data || res;
      // Transform to FullCalendar event format
      const events = allBookings.map(b => ({
        id: b._id,
        title: `${b.slot?.slotNumber || '?'} - ${b.user?.name || 'Unknown'}`,
        start: b.startTime,
        end: b.endTime,
        color: getStatusColor(b.status),
        extendedProps: {
          status: b.status,
          vehicle: b.vehicleNumber,
          parking: b.parking?.name,
          amount: b.totalPrice,
        },
      }));
      setBookings(events);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#2196f3'; // blue
      case 'active': return '#4caf50'; // green
      case 'completed': return '#9e9e9e'; // grey
      case 'cancelled': return '#f44336'; // red
      default: return '#ff9800'; // orange for pending etc.
    }
  };

  const handleEventClick = (info) => {
    const { extendedProps } = info.event;
    alert(`
      Parking: ${extendedProps.parking}
      Slot: ${info.event.title}
      Status: ${extendedProps.status}
      Vehicle: ${extendedProps.vehicle}
      Amount: $${extendedProps.amount}
    `);
  };

  if (loading) return <Container><Skeleton variant="rectangular" height={400} /></Container>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Booking Calendar
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
            size="small"
          >
            <MenuItem value="dayGridMonth">Month</MenuItem>
            <MenuItem value="timeGridWeek">Week</MenuItem>
            <MenuItem value="timeGridDay">Day</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={bookings}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
        />
      </Paper>
    </Container>
  );
};

export default OwnerBookingCalendar;