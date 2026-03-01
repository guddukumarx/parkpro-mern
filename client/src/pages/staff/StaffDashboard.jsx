import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Alert,
} from "@mui/material";
import staffService from "../../services/staffService";
import { useAuth } from "../../context/AuthContext";

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await staffService.getDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Container>
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Permissions</Typography>
              <List>
                {Object.entries(data?.assignment?.permissions || {}).map(
                  ([key, val]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key}
                        secondary={val ? "Allowed" : "Not allowed"}
                      />
                    </ListItem>
                  ),
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Assigned Parkings</Typography>
              <List>
                {data?.parkings.map((p) => (
                  <ListItem key={p._id}>
                    <ListItemText primary={p.name} secondary={p.address} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {data?.assignment?.permissions.viewBookings && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Recent Bookings</Typography>
                <List>
                  {data.recentBookings.map((b) => (
                    <ListItem key={b._id}>
                      <ListItemText
                        primary={`Slot ${b.slot?.slotNumber}`}
                        secondary={`${new Date(b.startTime).toLocaleString()} - ${new Date(b.endTime).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default StaffDashboard;
