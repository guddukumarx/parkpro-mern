// src/layouts/PublicLayout.jsx
import React, { useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Footer from "../components/Footer"; // ✅ Import external Footer component

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  boxShadow: theme.shadows[1],
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& svg": {
    fontSize: 32,
    color: theme.palette.primary.main,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PublicLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Pricing", path: "/pricing" },
    { title: "Contact", path: "/contact" },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText
                primary={item.title}
                sx={{ color: theme.palette.text.secondary }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/login">
            <ListItemText
              primary="Login"
              sx={{ color: theme.palette.text.secondary }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/register">
            <ListItemText
              primary="Register"
              sx={{ color: theme.palette.primary.main }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo>
              <DirectionsCarIcon />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: theme.palette.text.secondary,
                  fontWeight: 700,
                }}
              >
                ParkPro
              </Typography>
            </Logo>

            {isMobile ? (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  {navLinks.map((link) => (
                    <NavButton
                      key={link.title}
                      component={RouterLink}
                      to={link.path}
                    >
                      {link.title}
                    </NavButton>
                  ))}
                </Box>
                <Box sx={{ ml: 3, display: "flex", gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Register
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer - Now using external Footer component with all features */}
      <Footer />
    </Box>
  );
};

export default PublicLayout;
