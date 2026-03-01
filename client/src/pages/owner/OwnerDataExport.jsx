import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import ownerService from '../../services/ownerService';

const OwnerDataExport = () => {
  const [exportType, setExportType] = useState('bookings');
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const blob = await ownerService.exportData(exportType, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess('Export started');
    } catch (err) {
      setError(err.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Export Your Data
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Export Type"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
            >
              <MenuItem value="bookings">Bookings</MenuItem>
              <MenuItem value="parkings">Parkings</MenuItem>
              <MenuItem value="customers">Customers</MenuItem>
              <MenuItem value="earnings">Earnings</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? 'Exporting...' : 'Download'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={4000}
        onClose={() => { setError(''); setSuccess(''); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={error ? 'error' : 'success'} onClose={() => { setError(''); setSuccess(''); }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerDataExport;