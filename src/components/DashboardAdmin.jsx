import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// --- Impor MUI ---
import {
    Box, Typography, CircularProgress, Alert, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Card, CardContent, CardHeader, Grid, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText, IconButton, Tooltip, Fade, useTheme,
    useMediaQuery, LinearProgress
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    Refresh as RefreshIcon,
    AdminPanelSettings as AdminIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
// -----------------

function DashboardAdmin() {
  const [reviewApps, setReviewApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionDialog, setActionDialog] = useState({ open: false, appId: null, newStatus: null, appData: null });
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchReviewApps = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/applications/admin`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (!response.ok) throw new Error('Gagal mengambil data review');
      const data = await response.json();
      setReviewApps(data);
    } catch (err) { 
      setError(err.message); 
    }
    finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) fetchReviewApps();
  }, [token]);

  const handleFinalize = async (appId, newStatus, appData) => {
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/applications/${appId}/finalize`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ new_status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal finalisasi');
      
      // Show success message
      setActionDialog({ open: false, appId: null, newStatus: null, appData: null });
      
      // Refresh the list
      fetchReviewApps(true);
      
      // Success alert
      alert(`Lamaran berhasil ${newStatus === 'accepted' ? 'disetujui' : 'ditolak'}!`);
      
    } catch (err) { 
      alert(`Error: ${err.message}`);
      setActionDialog({ open: false, appId: null, newStatus: null, appData: null });
    }
  };

  const openActionDialog = (appId, newStatus, appData) => {
    setActionDialog({
      open: true,
      appId,
      newStatus,
      appData
    });
  };

  const closeActionDialog = () => {
    setActionDialog({
      open: false,
      appId: null,
      newStatus: null,
      appData: null
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      viewed: 'info',
      admin_review: 'secondary',
      accepted: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const MobileApplicationCard = ({ application }) => {
    return (
      <Card 
        elevation={2} 
        sx={{ 
          mb: 2,
          borderLeft: `4px solid ${theme.palette.secondary.main}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4
          }
        }}
      >
        <CardContent>
          {/* Applicant Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {application.seeker_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {application.seeker_email}
              </Typography>
            </Box>
          </Box>

          {/* Job Info */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <WorkIcon sx={{ fontSize: 14, mr: 0.5 }} />
                Posisi
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {application.job_title}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 14, mr: 0.5 }} />
                Perusahaan
              </Typography>
              <Typography variant="body1">
                {application.company_name}
              </Typography>
            </Grid>
          </Grid>

          {/* Date */}
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Dilamar pada {new Date(application.applied_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Typography>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<ApproveIcon />}
              onClick={() => openActionDialog(application.application_id, 'accepted', application)}
              sx={{ flex: 1 }}
            >
              Setujui
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<RejectIcon />}
              onClick={() => openActionDialog(application.application_id, 'rejected', application)}
              sx={{ flex: 1 }}
            >
              Tolak
            </Button>
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
          Memuat data lamaran...
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
          '& .MuiAlert-message': { width: '100%' }
        }}
        action={
          <Button color="inherit" size="small" onClick={() => fetchReviewApps()}>
            Coba Lagi
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AdminIcon sx={{ mr: 1 }} />
            Dashboard Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola dan tinjau lamaran pekerjaan yang membutuhkan persetujuan final
          </Typography>
        </Box>
        
        <Tooltip title="Refresh data">
          <IconButton 
            onClick={() => fetchReviewApps(true)}
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

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: 'center', p: 2, backgroundColor: 'secondary.light' }}>
            <Typography variant="h3" color="secondary.main" fontWeight="bold">
              {reviewApps.length}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              Total Menunggu Review
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="text.secondary" fontWeight="bold">
              {reviewApps.filter(app => app.status === 'admin_review').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dalam Review
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {reviewApps.filter(app => app.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Menunggu
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {reviewApps.filter(app => app.status === 'viewed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dilihat Perekrut
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Applications List */}
      {reviewApps.length === 0 ? (
        <Card 
          elevation={2} 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'grey.50'
          }}
        >
          <CardContent>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Tidak Ada Lamaran Menunggu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Semua lamaran telah diproses. Tidak ada yang membutuhkan persetujuan final saat ini.
            </Typography>
          </CardContent>
        </Card>
      ) : isMobile ? (
        // Mobile View
        <Fade in={!loading} timeout={500}>
          <Box>
            {reviewApps.map((application, index) => (
              <MobileApplicationCard 
                key={application.application_id} 
                application={application} 
              />
            ))}
          </Box>
        </Fade>
      ) : (
        // Desktop Table View
        <Fade in={!loading} timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Lamaran Menunggu Persetujuan Final
                </Typography>
              }
              subheader={`${reviewApps.length} lamaran membutuhkan tinjauan Anda`}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.8)' }
              }}
            />
            <TableContainer>
              <Table aria-label="Tabel Review Admin">
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: 'primary.light',
                    '& th': { 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 2
                    } 
                  }}>
                    <TableCell>Pelamar</TableCell>
                    <TableCell>Posisi</TableCell>
                    <TableCell>Perusahaan</TableCell>
                    <TableCell>Tanggal Lamar</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewApps.map((app) => (
                    <TableRow 
                      key={app.application_id} 
                      hover
                      sx={{ 
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                            {app.seeker_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <EmailIcon sx={{ mr: 0.5, fontSize: 14 }} />
                            {app.seeker_email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {app.job_title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {app.company_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {new Date(app.applied_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status.replace('_', ' ').toUpperCase()} 
                          color={getStatusColor(app.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Setujui lamaran">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<ApproveIcon />}
                              onClick={() => openActionDialog(app.application_id, 'accepted', app)}
                              sx={{ minWidth: '100px' }}
                            >
                              Setujui
                            </Button>
                          </Tooltip>
                          <Tooltip title="Tolak lamaran">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<RejectIcon />}
                              onClick={() => openActionDialog(app.application_id, 'rejected', app)}
                              sx={{ minWidth: '100px' }}
                            >
                              Tolak
                            </Button>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Fade>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={closeActionDialog}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
          Konfirmasi Tindakan
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionDialog.newStatus === 'accepted' 
              ? `Apakah Anda yakin ingin menyetujui lamaran dari ${actionDialog.appData?.seeker_name} untuk posisi ${actionDialog.appData?.job_title}?`
              : `Apakah Anda yakin ingin menolak lamaran dari ${actionDialog.appData?.seeker_name} untuk posisi ${actionDialog.appData?.job_title}?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeActionDialog} color="inherit">
            Batal
          </Button>
          <Button
            onClick={() => handleFinalize(actionDialog.appId, actionDialog.newStatus, actionDialog.appData)}
            variant="contained"
            color={actionDialog.newStatus === 'accepted' ? 'success' : 'error'}
            startIcon={actionDialog.newStatus === 'accepted' ? <ApproveIcon /> : <RejectIcon />}
          >
            {actionDialog.newStatus === 'accepted' ? 'Ya, Setujui' : 'Ya, Tolak'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardAdmin;