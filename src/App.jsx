import React from 'react';
import { Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Link as MuiLink,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Work as WorkIcon,
  Accessibility as AccessibilityIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Portal Karier Inklusif
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Memuat aplikasi...
          </Typography>
        </Box>
      </Box>
    );
  }

  const drawer = (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <AccessibilityIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Portal Karier
        </Typography>
      </Box>
      
      <List>
        <ListItem button component={RouterLink} to="/" onClick={handleDrawerToggle}>
          <ListItemText primary="Beranda" />
        </ListItem>
        
        {user ? (
          <>
            <ListItem button component={RouterLink} to="/dashboard" onClick={handleDrawerToggle}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register" onClick={handleDrawerToggle}>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Modern AppBar */}
      <AppBar 
        position="static" 
        elevation={2}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '2px solid',
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AccessibilityIcon sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/"
              sx={{ 
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              Portal Karier Inklusif
            </Typography>
          </Box>

          {/* Mobile Menu */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            /* Desktop Navigation */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                sx={{ 
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Beranda
              </Button>

              {user ? (
                <>
                  <Chip
                    icon={<PersonIcon />}
                    label={`Halo, ${user.full_name}`}
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      fontWeight: 600
                    }}
                    onClick={handleMenuOpen}
                    clickable
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 160,
                        borderRadius: 2
                      }
                    }}
                  >
                    <MenuItem 
                      component={RouterLink} 
                      to="/dashboard"
                      onClick={handleMenuClose}
                    >
                      <DashboardIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outlined"
                    color="inherit"
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    Daftar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content - FULL WIDTH */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: 0
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        </Routes>
      </Box>

      {/* Modern Footer */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          py: 4,
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccessibilityIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Portal Karier Inklusif
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', md: 'right' } }}>
              © {new Date().getFullYear()} Portal Karier Inklusif. 
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {' '}Dibangun untuk UAS - Inklusivitas dalam Dunia Kerja
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;