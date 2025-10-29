import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// --- Impor Komponen MUI ---
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    CircularProgress,
    Link as MuiLink,
    Paper,
    Grid,
    Fade,
    InputAdornment,
    Divider,
    Chip
} from '@mui/material';

// --- Impor Icons MUI ---
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    Accessibility as AccessibilityIcon
} from '@mui/icons-material';
// -------------------------

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:3001/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login gagal');
      
      login(data.token);
      navigate('/dashboard');
    } catch (err) { 
      setError(err.message); 
    } 
    finally { 
      setLoading(false); 
    }
  }

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
        {/* Left Side - Branding */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                icon={<AccessibilityIcon />}
                label="Portal Karier Inklusif"
                color="primary"
                variant="filled"
                sx={{ 
                  mb: 3,
                  fontSize: '1.1rem',
                  padding: '12px 16px',
                  backgroundColor: 'primary.main',
                  color: 'white'
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
                Masuk ke Akun Anda
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph
                sx={{ mb: 4, maxWidth: '400px', mx: { xs: 'auto', md: 0 } }}
              >
                Akses dashboard Anda dan temukan peluang karier yang sesuai 
                dengan keahlian dan kebutuhan Anda.
              </Typography>

              {/* Features List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <PersonIcon color="primary" />, text: "Akses ke lowongan kerja inklusif" },
                  { icon: <WorkIcon color="primary" />, text: "Kelamar pekerjaan dengan mudah" },
                  { icon: <AccessibilityIcon color="primary" />, text: "Dukungan aksesibilitas penuh" }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.icon}
                    <Typography variant="body1" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
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
                  Login
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Masukkan kredensial Anda untuk melanjutkan
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* Email Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Alamat Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  autoComplete="current-password"
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

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
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
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Masuk ke Akun'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    atau
                  </Typography>
                </Divider>

                {/* Register Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Belum punya akun?
                  </Typography>
                  <MuiLink 
                    component={RouterLink} 
                    to="/register" 
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
                    Daftar Sekarang
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

export default LoginPage;