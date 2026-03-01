// src/pages/admin/AdminBlacklist.jsx
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
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Storefront as StoreIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import adminService from "../../services/adminService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
}));

const AnimatedRow = motion(TableRow);
const AnimatedCard = motion(Card);

const AdminBlacklist = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchBlacklist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getAllBlacklist({
        page: page + 1,
        limit: rowsPerPage,
      });
      setBlacklist(res.data || res);
      setTotal(res.pagination?.total || res.length || 0);
    } catch (err) {
      setError(err.message || "Failed to load blacklist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, [page, rowsPerPage]);

  // Client‑side search (optional – backend also supports filtering via query)
  const filteredBlacklist = blacklist.filter(
    (entry) =>
      entry.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.parking?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Desktop table view
  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>Parking</StyledTableCell>
            <StyledTableCell>User</StyledTableCell>
            <StyledTableCell>Reason</StyledTableCell>
            <StyledTableCell>Added By</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {filteredBlacklist.map((entry, index) => (
              <AnimatedRow
                key={entry._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                hover
              >
                <TableCell>{entry.parking?.name || "—"}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {entry.user?.name?.charAt(0) || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {entry.user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{entry.reason || "—"}</TableCell>
                <TableCell>{entry.createdBy?.name || "—"}</TableCell>
                <TableCell>
                  {new Date(entry.createdAt).toLocaleDateString()}
                </TableCell>
              </AnimatedRow>
            ))}
          </AnimatePresence>
          {filteredBlacklist.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No blacklist entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile card view
  const renderCards = () => (
    <Grid container spacing={2}>
      <AnimatePresence>
        {filteredBlacklist.map((entry, index) => (
          <Grid item xs={12} key={entry._id}>
            <AnimatedCard
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {entry.parking?.name || "Unknown Parking"}
                  </Typography>
                  <Chip
                    size="small"
                    label={new Date(entry.createdAt).toLocaleDateString()}
                    variant="outlined"
                  />
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {entry.user?.name?.charAt(0) || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{entry.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Reason:</strong>{" "}
                  {entry.reason || "No reason provided"}
                </Typography>
                <Typography variant="caption" display="block">
                  Added by: {entry.createdBy?.name || "Unknown"}
                </Typography>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </AnimatePresence>
      {filteredBlacklist.length === 0 && !loading && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No blacklist entries found
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Blacklist Management
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by user name, email or parking"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
      ) : (
        <>
          {isMobile ? renderCards() : renderTable()}

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default AdminBlacklist;
