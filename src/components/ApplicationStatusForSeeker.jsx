import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// --- Impor MUI ---
import {
    Box, Typography, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Card, CardContent, CardHeader, Grid, Fade, useTheme, useMediaQuery,
    Tooltip, IconButton, LinearProgress
} from '@mui/material';
import {
    Visibility as ViewedIcon,
    Pending as PendingIcon,
    AdminPanelSettings as AdminIcon,
    CheckCircle as AcceptedIcon,
    Cancel as RejectedIcon,
    Refresh as RefreshIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
// -----------------

function ApplicationStatusForSeeker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchApplications = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3001/api/applications/seeker`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (!response.ok) throw new Error('Gagal mengambil data lamaran');
      const data = await response.json();
      setApplications(data);
    } catch (err) { 
      setError(err.message); 
    }
    finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    } else { 
      setLoading(false); 
      setError("Login untuk melihat status."); 
    }
  }, [token]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'warning',
        icon: <PendingIcon />,
        label: 'Menunggu',
        description: 'Lamaran Anda sedang menunggu ditinjau'
      },
      viewed: {
        color: 'info',
        icon: <ViewedIcon />,
        label: 'Dilihat',
        description: 'Lamaran Anda telah dilihat oleh perekrut'
      },
      admin_review: {
        color: 'secondary',
        icon: <AdminIcon />,
        label: 'Review Admin',
        description: 'Lamaran sedang dalam tinjauan admin'
      },
      accepted: {
        color: 'success',
        icon: <AcceptedIcon />,
        label: 'Diterima',
        description: 'Selamat! Lamaran Anda diterima 🎉'
      },
      rejected: {
        color: 'error',
        icon: <RejectedIcon />,
        label: 'Ditolak',
        description: 'Lamaran Anda belum berhasil kali ini'
      }
    };
    return configs[status] || { color: 'default', icon: null, label: status, description: '' };
  };

  const getStatusChip = (status) => {
    const config = getStatusConfig(status);
    return (
      <Tooltip title={config.description} arrow>
        <Chip 
          icon={config.icon} 
          label={config.label} 
          color={config.color} 
          size="small" 
          variant="filled"
          sx={{ 
            fontWeight: 600,
            minWidth: 100
          }}
        />
      </Tooltip>
    );
  };

  const handleRefresh = () => {
    fetchApplications(true);
  };

  // Mobile Card View
  const MobileApplicationCard = ({ application }) => {
    const statusConfig = getStatusConfig(application.status);
    
    return (
      <Card 
        elevation={2} 
        sx={{ 
          mb: 2,
          borderLeft: `4px solid ${theme.palette[statusConfig.color]?.main || theme.palette.grey[400]}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 4,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {application.job_title || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {application.company_name || 'N/A'}
              </Typography>
            </Box>
            {getStatusChip(application.status)}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
              {new Date(application.applied_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Memuat status lamaran...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2,
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          token && (
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Coba Lagi
            </Button>
          )
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header dengan Refresh Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        
        <Tooltip title="Refresh status">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      {applications.length === 0 ? (
        <Card 
          elevation={2} 
          sx={{ 
            textAlign: 'center', 
            py: 6,
            backgroundColor: 'grey.50'
          }}
        >
          <CardContent>
            <WorkIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Belum Ada Lamaran
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Anda belum mengajukan lamaran pekerjaan. Mulai cari lowongan yang sesuai!
            </Typography>
          </CardContent>
        </Card>
      ) : isMobile ? (
        // Mobile View - Cards
        <Fade in={!loading} timeout={500}>
          <Box>
            {applications.map((application, index) => (
              <MobileApplicationCard 
                key={application.id} 
                application={application} 
              />
            ))}
          </Box>
        </Fade>
      ) : (
        // Desktop View - Table
        <Fade in={!loading} timeout={500}>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Table aria-label="Tabel Status Lamaran">
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: 'primary.main',
                  '& th': { 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 2
                  } 
                }}>
                  <TableCell>Posisi Pekerjaan</TableCell>
                  <TableCell>Perusahaan</TableCell>
                  <TableCell>Tanggal Melamar</TableCell>
                  <TableCell align="center">Status Lamaran</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application) => (
                  <TableRow 
                    key={application.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {application.job_title || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {application.company_name || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {new Date(application.applied_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(application.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {/* Summary Stats */}
      {applications.length > 0 && (
        <Fade in={!loading} timeout={800}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {applications.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Lamaran
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {applications.filter(app => app.status === 'accepted').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Diterima
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {applications.filter(app => app.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Menunggu
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {applications.filter(app => app.status === 'rejected').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ditolak
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}
    </Box>
  );
}

export default ApplicationStatusForSeeker;