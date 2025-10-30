import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// --- Impor MUI ---
import {
    Container, Box, Typography, TextField, Button, Alert,
    CircularProgress, Link as MuiLink, Select, MenuItem, InputLabel, FormControl,
    Paper, Grid, Fade, InputAdornment, Divider, Chip, Stepper, Step, StepLabel
} from '@mui/material';

// --- Impor Icons MUI ---
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Accessibility as AccessibilityIcon,
    HowToReg as HowToRegIcon
} from '@mui/icons-material';
// -----------------

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('seeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registrasi gagal');
      
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) { 
      setError(err.message); 
    }
    finally { 
      setLoading(false); 
    }
  }

  const roleDescriptions = {
    seeker: {
      title: "Pencari Kerja",
      icon: <PersonIcon />,
      description: "Cari dan lamar lowongan kerja yang sesuai dengan keahlian Anda",
      features: [
        "Akses ke lowongan inklusif",
        "Kelola status lamaran",
        "Dukungan aksesibilitas penuh"
      ]
    },
    recruiter: {
      title: "Perekrut",
      icon: <BusinessIcon />,
      description: "Pasang lowongan dan kelola kandidat untuk perusahaan Anda",
      features: [
        "Pasang lowongan kerja",
        "Kelola aplikasi pelamar",
        "Temukan talenta berkualitas"
      ]
    }
  };

  const currentRole = roleDescriptions[role];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        width: '100%'
      }}
    >
      <Grid container spacing={6} alignItems="center">
        {/* Left Side - Role Selection & Info */}
        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                icon={<AccessibilityIcon />}
                label="Bergabung dengan Kami"
                color="primary"
                variant="filled"
                sx={{ 
                  mb: 3,
                  fontSize: '1.1rem',
                  padding: '12px 16px',
                  backgroundColor: 'primary.main'
                }}
              />
              
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2
                }}
              >
                Buat Akun Baru
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph
                sx={{ mb: 4 }}
              >
                Bergabunglah dengan platform karier inklusif kami dan mulai 
                perjalanan profesional Anda.
              </Typography>

              {/* Role Selection */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="role-select-label">Daftar Sebagai</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={role}
                  label="Daftar Sebagai"
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="seeker">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PersonIcon />
                      <Box>
                        <Typography variant="body1">Pencari Kerja</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Cari pekerjaan yang sesuai
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="recruiter">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BusinessIcon />
                      <Box>
                        <Typography variant="body1">Perekrut</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pasang lowongan kerja
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Role Description */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: 'primary.50',
                  border: '1px solid',
                  borderColor: 'primary.100'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {currentRole.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {currentRole.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {currentRole.description}
                </Typography>

                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {currentRole.features.map((feature, index) => (
                    <Typography 
                      key={index}
                      component="li" 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Grid>

        {/* Right Side - Registration Form */}
        <Grid item xs={12} md={7}>
          <Fade in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Paper 
              elevation={8}
              sx={{ 
                p: 6,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Form Pendaftaran
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Isi data diri Anda untuk membuat akun baru
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* Full Name Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Nama Lengkap"
                  name="fullName"
                  autoComplete="name"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Email Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Alamat Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Password Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ minWidth: 'auto', padding: '4px' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Error Alert */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      alignItems: 'center'
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Register Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={!loading && <HowToRegIcon />}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Buat Akun Sekarang'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sudah punya akun?
                  </Typography>
                </Divider>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <MuiLink 
                    component={RouterLink} 
                    to="/login" 
                    variant="h6"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      '&:hover': {
                        color: 'primary.dark',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Masuk ke Akun Anda
                  </MuiLink>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegisterPage;