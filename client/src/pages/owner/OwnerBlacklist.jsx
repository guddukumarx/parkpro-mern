// src/pages/owner/OwnerBlacklist.jsx
import React, { useState, useEffect } from "react";
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
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ownerService from "../../services/ownerService";
import parkingService from "../../services/parkingService";

const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const MotionTableRow = motion(TableRow);

const OwnerBlacklist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get parkingId from query parameter
  const query = new URLSearchParams(location.search);
  const initialParkingId = query.get("parkingId");

  const [parkings, setParkings] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState(
    initialParkingId || "",
  );
  const [loadingParkings, setLoadingParkings] = useState(true);
  const [parking, setParking] = useState(null);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addDialog, setAddDialog] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState("");
  const [searching, setSearching] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch owner's parkings on mount
  useEffect(() => {
    fetchParkings();
  }, []);

  // Set initial parking from query param after parkings load
  useEffect(() => {
    if (parkings.length > 0) {
      if (
        initialParkingId &&
        parkings.some((p) => p._id === initialParkingId)
      ) {
        setSelectedParkingId(initialParkingId);
      } else if (!selectedParkingId) {
        setSelectedParkingId(parkings[0]._id);
      }
    }
  }, [parkings, initialParkingId]);

  // Fetch blacklist when selectedParkingId changes
  useEffect(() => {
    if (selectedParkingId) {
      fetchBlacklist();
      // Also fetch parking details to show name in header
      const currentParking = parkings.find((p) => p._id === selectedParkingId);
      setParking(currentParking);
    } else {
      setBlacklist([]);
      setParking(null);
    }
  }, [selectedParkingId, parkings]);

  const fetchParkings = async () => {
    try {
      setLoadingParkings(true);
      const res = await parkingService.getOwnerParkings();
      const parkingsData = res.data || res;
      setParkings(parkingsData);
    } catch (err) {
      setError(err.message || "Failed to load parkings");
    } finally {
      setLoadingParkings(false);
    }
  };

  const fetchBlacklist = async () => {
    if (!selectedParkingId) return;
    try {
      setLoading(true);
      const res = await ownerService.getBlacklist(selectedParkingId);
      setBlacklist(res.data || res);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to load blacklist",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    try {
      const res = await ownerService.searchUsers(searchEmail);
      setSearchResults(res.data || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Search failed",
        severity: "error",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedUser || !selectedParkingId) return;
    try {
      await ownerService.addToBlacklist(
        selectedParkingId,
        selectedUser._id,
        reason,
      );
      setSnackbar({
        open: true,
        message: "User blacklisted",
        severity: "success",
      });
      setAddDialog(false);
      setSearchEmail("");
      setSearchResults([]);
      setSelectedUser(null);
      setReason("");
      fetchBlacklist();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed",
        severity: "error",
      });
    }
  };

  const handleRemove = async (userId) => {
    try {
      await ownerService.removeFromBlacklist(selectedParkingId, userId);
      setSnackbar({
        open: true,
        message: "User removed from blacklist",
        severity: "success",
      });
      fetchBlacklist();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed",
        severity: "error",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loadingParkings) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error && parkings.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Blacklist {parking ? `– ${parking.name}` : ""}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Parking</InputLabel>
          <Select
            value={selectedParkingId}
            label="Select Parking"
            onChange={(e) => setSelectedParkingId(e.target.value)}
            disabled={loadingParkings}
          >
            {parkings.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialog(true)}
          size={isMobile ? "small" : "medium"}
          disabled={!selectedParkingId}
        >
          Add to Blacklist
        </Button>
      </Box>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {loading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : blacklist.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <PersonAddIcon
                sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No blacklisted users
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setAddDialog(true)}
                disabled={!selectedParkingId}
              >
                Add a user
              </Button>
            </Paper>
          </motion.div>
        ) : isMobile ? (
          <Grid container spacing={2}>
            <AnimatePresence>
              {blacklist.map((entry, index) => (
                <Grid item xs={12} key={entry._id}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StyledCard>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {entry.user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.user?.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Reason:</strong>{" "}
                          {entry.reason || "Not specified"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Added on:{" "}
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemove(entry.user._id)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Date Added</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {blacklist.map((entry, index) => (
                    <MotionTableRow
                      key={entry._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>{entry.user?.name}</TableCell>
                      <TableCell>{entry.user?.email}</TableCell>
                      <TableCell>{entry.reason || "—"}</TableCell>
                      <TableCell>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(entry.user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>

      {/* Add Dialog */}
      <Dialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add User to Blacklist</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} disabled={searching}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select user:
              </Typography>
              <Grid container spacing={1}>
                {searchResults.map((u) => (
                  <Grid item xs={12} key={u._id}>
                    <Button
                      fullWidth
                      variant={
                        selectedUser?._id === u._id ? "contained" : "outlined"
                      }
                      sx={{ justifyContent: "flex-start" }}
                      onClick={() => setSelectedUser(u)}
                    >
                      {u.name} ({u.email})
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {selectedUser && (
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!selectedUser}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerBlacklist;
