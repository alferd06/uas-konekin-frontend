import React from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { 
  Link as RouterLink 
} from 'react-router-dom';
import { 
  Work as WorkIcon,
  Accessibility as AccessibilityIcon,
  Groups as GroupsIcon,
  EmojiPeople as EmojiPeopleIcon,
  ArrowForward as ArrowForwardIcon,
  PlayCircleFilled as PlayCircleFilledIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AccessibilityIcon fontSize="large" />,
      title: "Aksesibilitas Penuh",
      description: "Platform yang dirancang khusus untuk memenuhi kebutuhan berbagai jenis disabilitas"
    },
    {
      icon: <EmojiPeopleIcon fontSize="large" />,
      title: "Dukungan Karir",
      description: "Bimbingan karir dan pengembangan profesional untuk talenta disabilitas"
    },
    {
      icon: <GroupsIcon fontSize="large" />,
      title: "Keragaman & Inklusi",
      description: "Mendorong perusahaan untuk menciptakan lingkungan kerja yang inklusif"
    }
  ];

  const stats = [
    { number: "500+", label: "Perusahaan Mitra" },
    { number: "2,000+", label: "Lowongan Tersedia" },
    { number: "10,000+", label: "Talenta Terhubung" },
    { number: "95%", label: "Tingkat Kepuasan" }
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section - FULL WIDTH */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          position: 'relative',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                icon={<AccessibilityIcon />}
                label="Platform Inklusif"
                variant="filled"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 4,
                  fontSize: '1rem',
                  padding: '12px 16px'
                }}
              />
              
              <Typography 
                variant={isMobile ? "h3" : "h1"} 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 3
                }}
              >
                Selamat Datang di 
                <Box component="span" sx={{ color: '#ffd54f', display: 'block' }}>
                  Portal Karier Inklusif
                </Box>
              </Typography>
              
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Menghubungkan talenta penyandang disabilitas dengan peluang karier 
                yang setara dan bermakna di perusahaan-perusahaan terbaik.
              </Typography>

              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink} 
                  to={user ? "/dashboard" : "/login"}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    backgroundColor: '#ffd54f',
                    color: '#2d3748',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#ffca28',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255,213,79,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {user ? 'Buka Dashboard' : 'Mulai Sekarang'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  endIcon={<PlayCircleFilledIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#ffd54f',
                      color: '#ffd54f',
                      backgroundColor: 'rgba(255,213,79,0.1)'
                    }
                  }}
                >
                  Lihat Demo
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Grid container spacing={3} sx={{ maxWidth: '1400px', margin: '0 auto', mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <Typography variant="h4" component="div" color="primary" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section - COMPACT & NO BENEFITS */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Fade in={true} timeout={800}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2
                }}
              >
                Mengapa Memilih Kami?
              </Typography>
            </Fade>
            
            <Fade in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Platform kami dirancang khusus untuk mendukung perjalanan karir talenta disabilitas
              </Typography>
            </Fade>
          </Box>

          {/* Features Grid - Compact Cards */}
          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={10} md={8} lg={4} key={index}>
                <Fade in={true} timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Card 
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'divider',
                      maxWidth: 350, // Limit maximum width
                      mx: 'auto', // Center the card
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      p: 0, 
                      '&:last-child': { pb: 0 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      {/* Icon */}
                      <Box 
                        sx={{ 
                          color: 'primary.main', 
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {feature.icon}
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      >
                        {feature.title}
                      </Typography>

                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.5
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - FULL WIDTH */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          py: 8,
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          width: '100%'
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Siap Memulai Perjalanan Karir Anda?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
            Bergabunglah dengan ribuan talenta disabilitas yang telah menemukan 
            pekerjaan impian mereka melalui platform kami.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to={user ? "/dashboard" : "/register"}
            endIcon={<WorkIcon />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: '#f5576c',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'scale(1.05)'
              }
            }}
          >
            {user ? 'Lihat Lowongan' : 'Daftar Sekarang'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;