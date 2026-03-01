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
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  EventSeat as SeatIcon,
  Accessible as AccessibleIcon,
  Power as PowerIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parkingService from '../../services/parkingService';
import { connectSocket, joinParkingRoom, onSlotUpdate, disconnectSocket } from '../../services/socketService';

const SlotCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  transition: 'all 0.2s',
  '&.available': {
    borderLeft: `4px solid ${theme.palette.success.main}`,
  },
  '&.booked': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  '&.reserved': {
    borderLeft: `4px solid ${theme.palette.info.main}`,
  },
  '&.maintenance': {
    borderLeft: `4px solid ${theme.palette.warning.main}`,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'available': color = theme.palette.success.main; break;
    case 'booked': color = theme.palette.primary.main; break;
    case 'reserved': color = theme.palette.info.main; break;
    case 'maintenance': color = theme.palette.warning.main; break;
    default: color = theme.palette.grey[500];
  }
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: 600,
  };
});

const OwnerSlotMonitor = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [parkings, setParkings] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingParkings, setLoadingParkings] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check-in/out modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [actionType, setActionType] = useState('checkin'); // 'checkin' or 'checkout'

  useEffect(() => {
    fetchParkings();
  }, []);

  useEffect(() => {
    if (selectedParkingId) {
      fetchSlots();
      connectSocket();
      joinParkingRoom(selectedParkingId);
      onSlotUpdate((updatedSlot) => {
        setSlots(prev => prev.map(s => s._id === updatedSlot._id ? updatedSlot : s));
      });
    }
    return () => disconnectSocket();
  }, [selectedParkingId]);

  const fetchParkings = async () => {
    try {
      setLoadingParkings(true);
      const res = await parkingService.getOwnerParkings();
      setParkings(res.data || res);
      if (res.data?.length > 0) setSelectedParkingId(res.data[0]._id);
    } catch (err) {
      setError(err.message || 'Failed to load parkings');
    } finally {
      setLoadingParkings(false);
    }
  };

  const fetchSlots = async () => {
    if (!selectedParkingId) return;
    setLoadingSlots(true);
    try {
      const res = await parkingService.getSlotsByParking(selectedParkingId);
      setSlots(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCheckIn = async (slot) => {
    try {
      await parkingService.updateSlot(slot._id, { status: 'booked' });
      // Real-time update via socket will handle UI change
    } catch (err) {
      setError(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (slot) => {
    try {
      await parkingService.updateSlot(slot._id, { status: 'available' });
    } catch (err) {
      setError(err.message || 'Check-out failed');
    }
  };

  const handleStatusChange = async (slot, newStatus) => {
    try {
      await parkingService.updateSlot(slot._id, { status: newStatus });
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          slot.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'VIP': return <SeatIcon />;
      case 'Handicapped': return <AccessibleIcon />;
      case 'Electric': return <PowerIcon />;
      default: return <CarIcon />;
    }
  };

  const isLoading = loadingParkings || loadingSlots;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Live Slot Monitoring
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Select Parking</InputLabel>
          <Select
            value={selectedParkingId}
            label="Select Parking"
            onChange={(e) => setSelectedParkingId(e.target.value)}
            disabled={loadingParkings}
          >
            {parkings.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          placeholder="Search slot number or type"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="booked">Booked</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Slot Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => <Grid item xs={12} sm={6} md={4} lg={3} key={i}><Skeleton variant="rectangular" height={150} /></Grid>)}
        </Grid>
      ) : filteredSlots.length === 0 ? (
        <Alert severity="info">No slots found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredSlots.map(slot => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={slot._id}>
              <SlotCard className={slot.status}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{slot.slotNumber}</Typography>
                    <StatusChip label={slot.status} size="small" status={slot.status} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getTypeIcon(slot.type)}
                    <Typography variant="body2" sx={{ ml: 1 }}>{slot.type}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${slot.pricePerHour}/hr
                  </Typography>
                  {slot.currentBooking && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Vehicle: {slot.currentBooking.vehicleNumber}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around' }}>
                  {slot.status === 'available' && (
                    <Button size="small" variant="outlined" color="primary" onClick={() => handleCheckIn(slot)}>
                      Check-in
                    </Button>
                  )}
                  {slot.status === 'booked' && (
                    <Button size="small" variant="outlined" color="success" onClick={() => handleCheckOut(slot)}>
                      Check-out
                    </Button>
                  )}
                  <Button size="small" onClick={() => {
                    setSelectedSlot(slot);
                    setModalOpen(true);
                  }}>
                    Change Status
                  </Button>
                </CardActions>
              </SlotCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Change Status Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Change Status for Slot {selectedSlot?.slotNumber}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={selectedSlot?.status || ''}
              onChange={(e) => {
                handleStatusChange(selectedSlot, e.target.value);
                setModalOpen(false);
              }}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="booked">Booked</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OwnerSlotMonitor;