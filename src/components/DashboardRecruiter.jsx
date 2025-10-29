import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Link as MuiLink,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    IconButton,
    Tooltip,
    Fade,
    useTheme,
    useMediaQuery,
    LinearProgress,
    Avatar,
    Tab,
    Tabs
} from '@mui/material';
import {
    Add as AddIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    People as PeopleIcon,
    Visibility as ViewIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Email as EmailIcon,
    Description as ResumeIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    CorporateFare as CompanyIcon,
    Edit as EditIcon
} from '@mui/icons-material';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// --- Komponen AddJobForm (Dipercantik) ---
function AddJobForm({ refreshJobs, companyProfileExists }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!companyProfileExists) {
      setError("Harap lengkapi profil perusahaan Anda terlebih dahulu.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          location: jobLocation,
          salary_range: salaryRange
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menambah loker');
      alert('Loker berhasil ditambahkan!');
      setTitle('');
      setDescription('');
      setJobLocation('');
      setSalaryRange('');
      refreshJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Buat Lowongan Baru
          </Typography>
        }
        sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.8)' }
        }}
      />
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Judul Pekerjaan" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            fullWidth 
            margin="normal" 
            variant="outlined"
          />
          <TextField 
            label="Deskripsi Pekerjaan" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
            fullWidth 
            margin="normal" 
            multiline 
            rows={4} 
            variant="outlined"
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Lokasi" 
                value={jobLocation} 
                onChange={e => setJobLocation(e.target.value)} 
                fullWidth 
                margin="normal" 
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Range Gaji" 
                value={salaryRange} 
                onChange={e => setSalaryRange(e.target.value)} 
                fullWidth 
                margin="normal" 
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 2 }} 
            disabled={loading || !companyProfileExists}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
          </Button>
          {!companyProfileExists && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Lengkapi profil perusahaan untuk bisa membuat lowongan.
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// --- Komponen EditCompanyProfileForm (Dipercantik) ---
function EditCompanyProfileForm({ initialProfile, onProfileUpdate }) {
  const [companyName, setCompanyName] = useState(initialProfile?.company_name || '');
  const [description, setDescription] = useState(initialProfile?.company_description || '');
  const [website, setWebsite] = useState(initialProfile?.company_website || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company_name: companyName,
          company_description: description,
          company_website: website
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal update profil');
      setSuccess('Profil perusahaan berhasil disimpan!');
      onProfileUpdate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardHeader
        avatar={<CompanyIcon sx={{ fontSize: 32 }} />}
        title={
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Profil Perusahaan
          </Typography>
        }
        subheader="Kelola informasi perusahaan Anda"
        sx={{ backgroundColor: 'secondary.light' }}
      />
      <CardContent>
        {!initialProfile?.company_name && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Harap lengkapi profil perusahaan Anda.
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Nama Perusahaan" 
            value={companyName} 
            onChange={e => setCompanyName(e.target.value)} 
            required 
            fullWidth 
            margin="normal" 
            variant="outlined"
          />
          <TextField 
            label="Deskripsi Perusahaan" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            fullWidth 
            margin="normal" 
            multiline 
            rows={3} 
            variant="outlined"
          />
          <TextField 
            label="Website Perusahaan (Opsional)" 
            value={website} 
            onChange={e => setWebsite(e.target.value)} 
            fullWidth 
            margin="normal" 
            variant="outlined"
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
          >
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Komponen Utama Recruiter Dashboard (DIPERCANTIK)
function DashboardRecruiter() {
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [errorApplicants, setErrorApplicants] = useState('');
  const [reviewDialog, setReviewDialog] = useState({ open: false, applicant: null, newStatus: null });
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  async function fetchCompanyProfile() {
    setErrorProfile('');
    setLoadingProfile(true);
    try {
      const response = await fetch(`${apiUrl}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil profil perusahaan');
      const data = await response.json();
      setCompanyProfile(data);
    } catch (err) { 
      setErrorProfile(err.message); 
    }
    finally { 
      setLoadingProfile(false); 
    }
  }

  async function fetchMyJobs() {
    setErrorJobs('');
    setLoadingJobs(true); 
    try {
      const response = await fetch(`${apiUrl}/api/jobs/my-company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil lowongan saya');
      const data = await response.json();
      setMyJobs(data);
    } catch (err) {
      setErrorJobs(err.message);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchCompanyProfile();
      fetchMyJobs();
    }
  }, [token]);

  const handleProfileUpdate = (updatedProfile) => {
    setCompanyProfile(updatedProfile);
  };

  const companyProfileExists = !!companyProfile?.company_id;

  async function fetchApplicants(jobId) {
    if (!jobId) return;

    setErrorApplicants('');
    setLoadingApplicants(true);
    setApplicants([]);

    try {
      const response = await fetch(`${apiUrl}/api/applications/recruiter/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil data pelamar');
      const data = await response.json();
      setApplicants(data);
    } catch (err) {
      setErrorApplicants(err.message);
    } finally {
      setLoadingApplicants(false);
    }
  }

  const openReviewDialog = (applicant, newStatus) => {
    setReviewDialog({
      open: true,
      applicant,
      newStatus
    });
  };

  const closeReviewDialog = () => {
    setReviewDialog({
      open: false,
      applicant: null,
      newStatus: null
    });
  };

  async function handleReview(applicationId, newStatus) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengupdate status');
      
      alert(`Status lamaran berhasil diubah menjadi ${newStatus}`);
      closeReviewDialog();
      
      if (selectedJobId) {
        fetchApplicants(selectedJobId);
      }
    } catch (err) {
      setErrorApplicants(err.message);
      alert(`Error: ${err.message}`);
    }
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Menunggu' },
      viewed: { color: 'info', label: 'Dilihat' },
      admin_review: { color: 'secondary', label: 'Review Admin' },
      accepted: { color: 'success', label: 'Diterima' },
      rejected: { color: 'error', label: 'Ditolak' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const JobListCard = ({ job }) => (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: selectedJobId === job.id ? `2px solid ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
      onClick={() => {
        setSelectedJobId(job.id);
        fetchApplicants(job.id);
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {job.location || 'Lokasi tidak tersedia'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.salary_range || 'Gaji tidak tersedia'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip 
              label={job.is_active ? 'Aktif' : 'Nonaktif'} 
              color={job.is_active ? 'success' : 'default'} 
              size="small" 
            />
            <Button 
              size="small" 
              variant="outlined"
              startIcon={<PeopleIcon />}
            >
              Lihat Pelamar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ApplicantRow = ({ applicant }) => (
    <TableRow hover sx={{ transition: 'background-color 0.2s ease' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
            {applicant.seeker_name?.charAt(0) || 'P'}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {applicant.seeker_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {applicant.seeker_email}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {applicant.skills?.join(', ') || 'Tidak ada skills'}
        </Typography>
      </TableCell>
      <TableCell>
        {applicant.resume_url ? (
          <Tooltip title="Lihat CV">
            <IconButton 
              size="small" 
              href={applicant.resume_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ResumeIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Tidak ada CV
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {getStatusChip(applicant.status)}
      </TableCell>
      <TableCell align="center">
        {(applicant.status === 'pending' || applicant.status === 'viewed') ? (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Tooltip title="Setujui dan lanjutkan ke admin">
              <IconButton
                color="success"
                onClick={() => openReviewDialog(applicant, 'admin_review')}
                size="small"
              >
                <ApproveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tolak lamaran">
              <IconButton
                color="error"
                onClick={() => openReviewDialog(applicant, 'rejected')}
                size="small"
              >
                <RejectIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Sudah direview
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 2 }} />
          Dashboard Perekrut
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Kelola lowongan kerja dan tinjau aplikasi pelamar
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Column 1: Forms */}
        <Grid item xs={12} lg={5}>
          {loadingProfile && (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>Memuat profil...</Typography>
            </Card>
          )}
          {errorProfile && <Alert severity="error" sx={{ mb: 2 }}>{errorProfile}</Alert>}
          {!loadingProfile && (
            <EditCompanyProfileForm 
              initialProfile={companyProfile} 
              onProfileUpdate={handleProfileUpdate} 
            />
          )}
          
          <AddJobForm 
            refreshJobs={fetchMyJobs} 
            companyProfileExists={companyProfileExists} 
          />
        </Grid>

        {/* Column 2: Job List & Applicants */}
        <Grid item xs={12} lg={7}>
          {/* Job List */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  Lowongan Saya
                </Typography>
              }
              action={
                <Tooltip title="Refresh lowongan">
                  <IconButton onClick={fetchMyJobs} disabled={loadingJobs}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              }
              sx={{ backgroundColor: 'primary.main', color: 'white' }}
            />
            <CardContent>
              {loadingJobs && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              {errorJobs && <Alert severity="error">{errorJobs}</Alert>}
              {!loadingJobs && myJobs.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WorkIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Belum Ada Lowongan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mulai buat lowongan pertama Anda
                  </Typography>
                </Box>
              )}
              {!loadingJobs && myJobs.length > 0 && (
                <Box>
                  {myJobs.map((job) => (
                    <JobListCard key={job.id} job={job} />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Applicant Details */}
          {selectedJobId && (
            <Fade in={true} timeout={500}>
              <Card elevation={3}>
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ mr: 1 }} />
                      Pelamar untuk: {myJobs.find(j => j.id === selectedJobId)?.title || `ID ${selectedJobId}`}
                    </Typography>
                  }
                  action={
                    <Tooltip title="Tutup daftar pelamar">
                      <IconButton onClick={() => setSelectedJobId(null)}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ backgroundColor: 'secondary.main', color: 'white' }}
                />
                <CardContent>
                  {loadingApplicants && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  {errorApplicants && <Alert severity="error">{errorApplicants}</Alert>}
                  {!loadingApplicants && applicants.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <PeopleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Belum Ada Pelamar
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Belum ada yang melamar untuk lowongan ini
                      </Typography>
                    </Box>
                  )}
                  {!loadingApplicants && applicants.length > 0 && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell><strong>Pelamar</strong></TableCell>
                            <TableCell><strong>Skills</strong></TableCell>
                            <TableCell><strong>CV</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applicants.map((applicant) => (
                            <ApplicantRow key={applicant.application_id} applicant={applicant} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Fade>
          )}
        </Grid>
      </Grid>

      {/* Review Confirmation Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={closeReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          {reviewDialog.newStatus === 'admin_review' ? (
            <ApproveIcon sx={{ mr: 1, color: 'success.main' }} />
          ) : (
            <RejectIcon sx={{ mr: 1, color: 'error.main' }} />
          )}
          Konfirmasi Tindakan
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {reviewDialog.newStatus === 'admin_review' 
              ? `Apakah Anda yakin ingin menyetujui lamaran dari ${reviewDialog.applicant?.seeker_name} dan meneruskannya ke admin untuk review final?`
              : `Apakah Anda yakin ingin menolak lamaran dari ${reviewDialog.applicant?.seeker_name}?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog} color="inherit">
            Batal
          </Button>
          <Button
            onClick={() => handleReview(reviewDialog.applicant?.application_id, reviewDialog.newStatus)}
            variant="contained"
            color={reviewDialog.newStatus === 'admin_review' ? 'success' : 'error'}
            startIcon={reviewDialog.newStatus === 'admin_review' ? <ApproveIcon /> : <RejectIcon />}
          >
            {reviewDialog.newStatus === 'admin_review' ? 'Setujui' : 'Tolak'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardRecruiter;