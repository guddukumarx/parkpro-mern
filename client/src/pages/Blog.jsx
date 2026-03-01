// src/pages/Blog.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Pagination,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#ffffff",
  padding: theme.spacing(12, 2),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)`,
    clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const Blog = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Dummy data – replace with API calls later
  const categories = [
    "All",
    "Parking Tips",
    "City News",
    "Technology",
    "Owner Stories",
    "Events",
  ];

  const featuredPosts = [
    {
      id: 1,
      title: "5 Tips for Finding Parking in Busy Downtown Areas",
      excerpt:
        "Navigating crowded city streets can be stressful. Here are our top tips to find parking quickly and save time.",
      image: "https://source.unsplash.com/random/800x600/?parking,city",
      date: "Feb 15, 2026",
      author: "Sarah Johnson",
      category: "Parking Tips",
    },
    {
      id: 2,
      title: "How Dynamic Pricing is Revolutionizing Parking Lots",
      excerpt:
        "Learn how smart pricing algorithms help owners maximize revenue and drivers find better deals.",
      image: "https://source.unsplash.com/random/800x600/?parking,technology",
      date: "Feb 10, 2026",
      author: "Mike Chen",
      category: "Technology",
    },
    {
      id: 3,
      title: "A Day in the Life of a Parking Lot Owner",
      excerpt:
        "We interviewed a successful parking lot owner to learn about their experience using ParkPro.",
      image: "https://source.unsplash.com/random/800x600/?parking,owner",
      date: "Feb 5, 2026",
      author: "Emily Davis",
      category: "Owner Stories",
    },
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Top 10 Cities with the Best Parking Apps",
      excerpt:
        "Which cities are leading the way in smart parking technology? Find out here.",
      image: "https://source.unsplash.com/random/800x600/?city,skyline",
      date: "Feb 1, 2026",
      author: "John Smith",
      category: "City News",
    },
    {
      id: 5,
      title: "How to Prepare for Your First EV Charging Session",
      excerpt:
        "Electric vehicle owners: here’s what you need to know before using our EV charging stations.",
      image: "https://source.unsplash.com/random/800x600/?ev,charging",
      date: "Jan 28, 2026",
      author: "Lisa Wong",
      category: "Parking Tips",
    },
    {
      id: 6,
      title: "ParkPro’s New Feature: Real-Time Slot Monitoring",
      excerpt:
        "Owners can now watch live slot occupancy and manage check-ins/outs from their dashboard.",
      image: "https://source.unsplash.com/random/800x600/?dashboard,app",
      date: "Jan 20, 2026",
      author: "Alex Rivera",
      category: "Technology",
    },
    {
      id: 7,
      title: "Community Spotlight: How ParkPro Helped a Small Business",
      excerpt:
        "A local café owner shares how offering parking validation increased their foot traffic.",
      image: "https://source.unsplash.com/random/800x600/?cafe,street",
      date: "Jan 15, 2026",
      author: "Nina Patel",
      category: "Owner Stories",
    },
  ];

  const allPosts = [...featuredPosts, ...recentPosts];
  const postsPerPage = 4;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const currentPosts = allPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage,
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // In real app, filter posts based on search term
    console.log("Searching for:", searchTerm);
  };

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            ParkPro Blog
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, mb: 4 }}>
            Insights, tips, and stories from the world of parking.
          </Typography>
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <SearchIcon color="primary" />
            </InputAdornment>
            <TextField
              placeholder="Search articles..."
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, flex: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" sx={{ p: "10px" }} color="primary">
              Search
            </Button>
          </Paper>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Categories */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Browse by Category
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    variant={
                      selectedCategory === cat.toLowerCase()
                        ? "filled"
                        : "outlined"
                    }
                    color={
                      selectedCategory === cat.toLowerCase()
                        ? "primary"
                        : "default"
                    }
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                  />
                ))}
              </Box>
            </Box>

            {/* Featured Posts */}
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Featured Articles
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {featuredPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <BlogCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt={post.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {post.excerpt}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: theme.palette.text.secondary,
                            }}
                          />
                          <Typography variant="caption">{post.date}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: theme.palette.text.secondary,
                            }}
                          />
                          <Typography variant="caption">
                            {post.author}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/blog/${post.id}`}
                      >
                        Read More
                      </Button>
                    </CardActions>
                  </BlogCard>
                </Grid>
              ))}
            </Grid>

            {/* Recent Posts */}
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Recent Posts
            </Typography>
            <Grid container spacing={3}>
              {currentPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <BlogCard>
                    <CardMedia
                      component="img"
                      height="180"
                      image={post.image}
                      alt={post.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        fontWeight={600}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {post.excerpt.length > 80
                          ? post.excerpt.substring(0, 80) + "…"
                          : post.excerpt}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: theme.palette.text.secondary,
                            }}
                          />
                          <Typography variant="caption">{post.date}</Typography>
                        </Box>
                        <Chip
                          label={post.category}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </BlogCard>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
              />
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* About the Blog */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                About the Blog
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome to the official ParkPro blog! Here we share news, tips,
                and stories to help you get the most out of your parking
                experience. Whether you're a driver or a parking owner, you'll
                find valuable insights here.
              </Typography>
            </Paper>

            {/* Popular Categories */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Popular Categories
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {categories.slice(1).map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    variant="outlined"
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                  />
                ))}
              </Box>
            </Paper>

            {/* Recent Posts List */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Posts
              </Typography>
              {recentPosts.slice(0, 3).map((post) => (
                <Box key={post.id} sx={{ mb: 2 }}>
                  <Typography
                    component={RouterLink}
                    to={`/blog/${post.id}`}
                    variant="subtitle2"
                    sx={{
                      textDecoration: "none",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {post.date}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Blog;
