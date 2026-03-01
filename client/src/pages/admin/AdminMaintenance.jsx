// src/pages/admin/AdminMaintenance.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Skeleton,
} from '@mui/material';
import adminService from '../../services/adminService';

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRequests();
  }, [page, rowsPerPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllMaintenanceRequests({ page: page + 1, limit: rowsPerPage });
      setRequests(res.data || res);
      if (res.pagination) setTotal(res.pagination.total);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await adminService.updateMaintenanceRequest(editRequest._id, {
        status: editStatus,
        resolutionNotes: editNotes,
      });
      setSnackbar({ open: true, message: 'Request updated', severity: 'success' });
      setEditModal(false);
      fetchRequests();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Update failed', severity: 'error' });
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const getPriorityChip = (p) => {
    const colors = { low: 'default', medium: 'info', high: 'warning', critical: 'error' };
    return <Chip label={p} size="small" color={colors[p] || 'default'} />;
  };
  const getStatusChip = (s) => {
    const colors = { pending: 'default', 'in-progress': 'warning', resolved: 'success', closed: 'default' };
    return <Chip label={s} size="small" color={colors[s] || 'default'} />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>Maintenance Requests</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parking</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => <TableRow key={i}><TableCell colSpan={7}><Skeleton /></TableCell></TableRow>)
            ) : requests.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">No requests</TableCell></TableRow>
            ) : (
              requests.map(r => (
                <TableRow key={r._id}>
                  <TableCell>{r.parking?.name}</TableCell>
                  <TableCell>{r.slot?.slotNumber || '—'}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{getPriorityChip(r.priority)}</TableCell>
                  <TableCell>{getStatusChip(r.status)}</TableCell>
                  <TableCell>{r.reportedBy?.name}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => {
                      setEditRequest(r);
                      setEditStatus(r.status);
                      setEditNotes(r.resolutionNotes || '');
                      setEditModal(true);
                    }}>Update</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5,10,25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Update Modal (same as owner) */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Request</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Resolution Notes"
            multiline
            rows={3}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminMaintenance;