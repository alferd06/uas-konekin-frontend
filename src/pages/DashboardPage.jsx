import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Import Role-specific Dashboards
import JobListForSeeker from '../components/JobListForSeeker';
import ApplicationStatusForSeeker from '../components/ApplicationStatusForSeeker';
import DashboardRecruiter from '../components/DashboardRecruiter';
import DashboardAdmin from '../components/DashboardAdmin';

function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Alert severity="warning" sx={{ mb: 2, maxWidth: '1400px', margin: '0 auto' }}>
          Silakan login untuk mengakses dashboard.
        </Alert>
      </Box>
    );
  }

  const roleConfig = {
    seeker: {
      title: "Pencari Kerja",
      icon: <PersonIcon />,
      color: "primary",
      description: "Temukan lowongan kerja yang sesuai dengan keahlian Anda"
    },
    recruiter: {
      title: "Perekrut",
      icon: <BusinessIcon />,
      color: "secondary",
      description: "Kelola lowongan kerja dan aplikasi pelamar"
    },
    admin: {
      title: "Administrator",
      icon: <AdminIcon />,
      color: "error",
      description: "Kelola seluruh sistem dan pengguna"
    }
  };

  const currentRole = roleConfig[user.role];

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
      {/* Header Section */}
      <Grid container spacing={3} sx={{ mb: 4, maxWidth: '1400px', margin: '0 auto' }}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    opacity: 0.9
                  }}
                >
                  Selamat datang kembali, {user.full_name}!
                </Typography>
              </Box>
              <Chip
                icon={currentRole.icon}
                label={currentRole.title}
                color={currentRole.color}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1rem',
                  padding: '8px 16px',
                  height: 'auto'
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Role-specific Content */}
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Grid container spacing={3}>
          {user.role === 'seeker' && (
            <Grid item xs={12}>
              <Card elevation={3} sx={{ mb: 3, width: '100%' }}> 
                <CardHeader
                  title={
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                      <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Lowongan Tersedia
                    </Typography>
                  }
                  subheader="Temukan dan lamar lowongan kerja yang sesuai dengan profil Anda"
                />
                <CardContent sx={{ pt: 0, width: '100%' }}>
                  <JobListForSeeker />
                </CardContent>
              </Card>

              <Card elevation={3} sx={{ width: '100%' }}>
                <CardHeader
                  title={
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Status Lamaran Saya
                    </Typography>
                  }
                  subheader="Pantau perkembangan aplikasi lamaran kerja Anda"
                />
                <CardContent sx={{ pt: 0, width: '100%' }}>
                  <ApplicationStatusForSeeker />
                </CardContent>
              </Card>
            </Grid>
          )}

          {user.role === 'recruiter' && (
            <Grid item xs={12}>
              <Card elevation={3} sx={{ width: '100%' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <BusinessIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      Dashboard Perekrut
                    </Typography>
                  }
                  subheader="Kelola lowongan kerja dan aplikasi pelamar"
                />
                <CardContent sx={{ width: '100%' }}>
                  <DashboardRecruiter />
                </CardContent>
              </Card>
            </Grid>
          )}

          {user.role === 'admin' && (
            <Grid item xs={12}>
              <Card elevation={3} sx={{ width: '100%' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <AdminIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      Dashboard Administrator
                    </Typography>
                  }
                  subheader="Kelola seluruh sistem dan pengguna"
                />
                <CardContent sx={{ width: '100%' }}>
                  <DashboardAdmin />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default DashboardPage;