import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
export default function Navbar() {
  const location = useLocation();
  return (
    <AppBar position="static" sx={{ bgcolor: '#18191c', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              fontWeight: 'bold',
              mr: 3,
              fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
              letterSpacing: '1px',
              background: 'linear-gradient(90deg,#00ff94 0%,#00cfff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent', 
              display: 'inline-block'
            }}>
            Web Tool Genius
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              className={location.pathname === "/" ? "nav-btn active" : "nav-btn"}>
              Home
            </Button>
            <Button
              component={Link}
              to="/pdf-tools"
              className={location.pathname.startsWith("/pdf-tools") ? "nav-btn active" : "nav-btn"}>
              PDF Tools
            </Button>
            <Button
              component={Link}
              to="/calculators"
              className={location.pathname.startsWith("/calculator") ? "nav-btn active" : "nav-btn"}>
              Calculators
            </Button>
            <Button
              component={Link}
              to="/compression"
              className={location.pathname.startsWith("/compression") ? "nav-btn active" : "nav-btn"}>
              Compress
            </Button>
            <Button
              component={Link}
              to="/converters"
              className={location.pathname.startsWith("/converters") ? "nav-btn active" : "nav-btn"}>
              Converters
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
