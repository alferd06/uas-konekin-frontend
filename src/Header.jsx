import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  useScrollTrigger,
  Slide,
  Fade,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Work as WorkIcon,
  Accessibility as AccessibilityIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Component untuk hide header on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getRoleIcon = (role) => {
    switch (role) {
      case 'seeker':
        return <PersonIcon sx={{ fontSize: 18 }} />;
      case 'recruiter':
        return <BusinessIcon sx={{ fontSize: 18 }} />;
      case 'admin':
        return <AdminIcon sx={{ fontSize: 18 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 18 }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'seeker':
        return 'primary';
      case 'recruiter':
        return 'secondary';
      case 'admin':
        return 'error';
      default:
        return 'default';
    }
  };

  const navigationItems = [
    { text: 'Beranda', path: '/', icon: <WorkIcon sx={{ fontSize: 18 }} /> },
    ...(user ? [{ text: 'Dashboard', path: '/dashboard', icon: <AdminIcon sx={{ fontSize: 18 }} /> }] : []),
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky"
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Toolbar sx={{ py: 1, minHeight: { xs: 60, md: 70 } }}>
            {/* Logo/Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <AccessibilityIcon 
                sx={{ 
                  mr: 2, 
                  fontSize: { xs: 28, md: 32 },
                  color: 'white'
                }} 
              />
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'white',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                Portal Karier Inklusif
              </Typography>
            </Box>

            {/* Navigation Items */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      borderRadius: 2,
                      px: 2,
                      py: 1
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* User Info & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  {/* User Info */}
                  <Fade in={true} timeout={800}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit' }}>
                              {user.full_name}
                            </Typography>
                          </Box>
                        }
                        color={getRoleColor(user.role)}
                        variant="filled"
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                      
                      {/* Logout Button */}
                      <Button
                        variant="outlined"
                        onClick={logout}
                        sx={{
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'white'
                          },
                          fontWeight: 600,
                          borderRadius: 2
                        }}
                      >
                        Keluar
                      </Button>
                    </Box>
                  </Fade>
                </>
              ) : (
                /* Login/Register Buttons */
                <Fade in={true} timeout={800}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        borderRadius: 2
                      }}
                    >
                      Masuk
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'white'
                        },
                        fontWeight: 600,
                        borderRadius: 2
                      }}
                    >
                      Daftar
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Secondary Navigation Bar */}
        {!isMobile && (
          <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', py: 1 }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                Menghubungkan talenta penyandang disabilitas dengan peluang karier yang setara
              </Typography>
            </Container>
          </Box>
        )}
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;