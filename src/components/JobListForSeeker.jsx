import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
// --- MUI Imports ---
import {
    Box, Typography, CircularProgress, Alert, Button, Grid,
    Card, CardContent, CardActions, Chip, Fade, useTheme,
    useMediaQuery, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, DialogContentText, LinearProgress
} from '@mui/material';
import {
    Work as WorkIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    AttachMoney as SalaryIcon,
    Schedule as TimeIcon,
    Send as ApplyIcon,
    Visibility as ViewIcon,
    Close as CloseIcon
} from '@mui/icons-material';
// -----------------
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function JobListForSeeker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- LOG #1: Cek render & token ---
  console.log('JobListForSeeker rendered. Token:', token);

  useEffect(() => {
    // --- LOG #2: Cek useEffect ---
    console.log('JobListForSeeker useEffect triggered. Token:', token);

    async function fetchJobs() {
      // --- LOG #4: Cek panggil fetchJobs ---
      console.log('fetchJobs function called...');
      setError('');
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // --- LOG #5: Cek status ---
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
           console.error('Fetch not OK. Status:', response.status);
           throw new Error('Gagal mengambil data loker');
        }
        const data = await response.json();
        setJobs(data);
         console.log('Jobs data received:', data); // --- LOG #7 ---
      } catch (err) {
        setError(err.message);
        console.error("fetchJobs CATCH block:", err); // --- LOG #8 ---
      } finally {
        setLoading(false);
         console.log('fetchJobs FINALLY block. Loading set to false.'); // --- LOG #9 ---
      }
    }

    if (token) {
      console.log('Token exists, attempting to call fetchJobs...'); // --- LOG #3 ---
      fetchJobs();
    } else {
      setLoading(false);
      setError("Silakan login untuk melihat lowongan.");
      console.log('Token NOT found in useEffect.'); // --- LOG #10 ---
    }
  }, [token]);

  // --- FUNGSI HANDLE APPLY (LENGKAP) ---
  async function handleApply(jobId) {
    if (!window.confirm("Apakah Anda yakin ingin melamar lowongan ini? Profil Anda akan otomatis terkirim.")) {
      return;
    }
    
    // --- LOG #11: Cek handleApply dipanggil ---
    console.log(`handleApply called for jobId: ${jobId}`);
    setError('');
    setApplyingJobId(jobId); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // --- LOG #12: Cek status apply ---
      console.log(`Apply response status for jobId ${jobId}:`, response.status);

      if (!response.ok) {
        let errorMsg = 'Gagal melamar pekerjaan';
        try {
            const errData = await response.json(); 
            errorMsg = errData.error || errorMsg;
        } catch (parseError) {
             console.error("Could not parse error response:", parseError);
        }
        console.error(`Apply not OK for jobId ${jobId}. Status: ${response.status}, Msg: ${errorMsg}`); // --- LOG #13 ---
        throw new Error(errorMsg);
      }
      
      alert('Lamaran berhasil dikirim!');
      
    } catch (err) {
      setError(err.message);
      console.error(`handleApply CATCH block for jobId ${jobId}:`, err); // --- LOG #15 ---
      alert(`Error: ${err.message}`);
    } finally {
      setApplyingJobId(null); 
      // --- LOG #16: Cek finally apply ---
      console.log(`handleApply FINALLY block for jobId ${jobId}. ApplyingJobId set to null.`);
    }
  }
  // --- AKHIR HANDLE APPLY ---

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setDetailDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailDialogOpen(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const JobCard = ({ job }) => (
    <Fade in={true} timeout={500}>
      <Card 
        elevation={2} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            elevation: 4,
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Job Title */}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {job.title}
          </Typography>

          {/* Company Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BusinessIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle1" color="primary" fontWeight="500">
              {job.company_name}
            </Typography>
          </Box>

          {/* Job Details */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {job.location || 'Lokasi tidak tersedia'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SalaryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {job.salary_range || 'Gaji tidak disebutkan'}
              </Typography>
            </Box>

            {job.created_at && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary">
                  Diposting {formatDate(job.created_at)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Job Description Preview */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2
            }}
          >
            {job.description || 'Tidak ada deskripsi'}
          </Typography>

          {/* Status Chip */}
          <Chip 
            icon={<WorkIcon />}
            label={job.is_active ? 'Lowongan Aktif' : 'Lowongan Ditutup'}
            color={job.is_active ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Tooltip title="Lihat detail lowongan">
            <Button
              size="small"
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => handleViewDetails(job)}
              sx={{ flex: 1 }}
            >
              Detail
            </Button>
          </Tooltip>
          
          <Tooltip title="Lamar lowongan ini">
            <Button
              size="small"
              variant="contained"
              startIcon={applyingJobId === job.id ? <CircularProgress size={16} /> : <ApplyIcon />}
              onClick={() => handleApply(job.id)}
              disabled={applyingJobId === job.id || !job.is_active}
              sx={{ flex: 1 }}
            >
              {applyingJobId === job.id ? 'Mengirim...' : 'Lamar'}
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Memuat lowongan kerja...
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
          token && (
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
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
      {/* Header */}
      

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <Card 
          elevation={2} 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'grey.50'
          }}
        >
          <CardContent>
            <WorkIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Belum Ada Lowongan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saat ini tidak ada lowongan yang tersedia. Silakan cek kembali nanti.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} lg={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Job Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {selectedJob?.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {selectedJob?.company_name}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetails} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedJob && (
            <Box>
              {/* Job Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Lokasi:</strong> {selectedJob.location || 'Tidak disebutkan'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SalaryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Gaji:</strong> {selectedJob.salary_range || 'Tidak disebutkan'}
                    </Typography>
                  </Box>
                </Grid>
                {selectedJob.created_at && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Diposting pada {formatDate(selectedJob.created_at)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Job Description */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Deskripsi Pekerjaan
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedJob.description || 'Tidak ada deskripsi yang tersedia.'}
              </Typography>

              {/* Status */}
              <Chip 
                icon={<WorkIcon />}
                label={selectedJob.is_active ? 'Lowongan Aktif' : 'Lowongan Ditutup'}
                color={selectedJob.is_active ? 'success' : 'default'}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDetails} color="inherit">
            Tutup
          </Button>
          <Button
            variant="contained"
            startIcon={<ApplyIcon />}
            onClick={() => {
              handleCloseDetails();
              handleApply(selectedJob.id);
            }}
            disabled={applyingJobId === selectedJob?.id || !selectedJob?.is_active}
          >
            Lamar Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default JobListForSeeker;