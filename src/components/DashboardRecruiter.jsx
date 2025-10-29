// src/components/DashboardRecruiter.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Box, Typography, TextField, Button, CircularProgress, Alert,
    List, ListItem, ListItemText, Divider, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Grid, Link as MuiLink,
    Card, CardContent, CardHeader, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText, IconButton, Tooltip, Fade, useTheme,
    LinearProgress, Avatar, Tabs, Tab // Added Tabs, Tab, LinearProgress
} from '@mui/material';
import {
    Add as AddIcon, Business as BusinessIcon, Work as WorkIcon, People as PeopleIcon,
    Visibility as ViewIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon,
    Email as EmailIcon, Description as ResumeIcon, Close as CloseIcon, Refresh as RefreshIcon,
    CorporateFare as CompanyIcon, Edit as EditIcon
} from '@mui/icons-material';

// Ambil apiUrl di sini agar bisa dipakai di semua fungsi dalam file
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; // Fallback ke localhost jika env var tidak ada


// --- Komponen AddJobForm ---
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
    setError(''); setLoading(true);
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/jobs`, { // Gunakan apiUrl
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, location: jobLocation, salary_range: salaryRange })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menambah loker');
      alert('Loker berhasil ditambahkan!');
      setTitle(''); setDescription(''); setJobLocation(''); setSalaryRange('');
      refreshJobs();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
            title={ <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><AddIcon sx={{ mr: 1 }} /> Buat Lowongan Baru </Typography> }
            sx={{ backgroundColor: 'primary.light' /* Warna lebih soft */}}
        />
        <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField label="Judul Pekerjaan" value={title} onChange={e => setTitle(e.target.value)} required fullWidth margin="dense" variant="outlined"/>
                <TextField label="Deskripsi Pekerjaan" value={description} onChange={e => setDescription(e.target.value)} required fullWidth margin="dense" multiline rows={4} variant="outlined"/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}> <TextField label="Lokasi" value={jobLocation} onChange={e => setJobLocation(e.target.value)} fullWidth margin="dense" variant="outlined"/> </Grid>
                    <Grid item xs={12} sm={6}> <TextField label="Range Gaji" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} fullWidth margin="dense" variant="outlined"/> </Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading || !companyProfileExists} startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}> {loading ? 'Menyimpan...' : 'Simpan Lowongan'} </Button>
                {!companyProfileExists && <Alert severity="warning" sx={{ mt: 2 }}> Lengkapi profil perusahaan untuk bisa membuat lowongan. </Alert> }
            </Box>
        </CardContent>
    </Card>
  );
}

// --- Komponen EditCompanyProfileForm ---
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
    setError(''); setSuccess(''); setLoading(true);
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/profile`, { // Gunakan apiUrl
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ company_name: companyName, company_description: description, company_website: website })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal update profil');
      setSuccess('Profil perusahaan berhasil disimpan!');
      onProfileUpdate(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

   return (
    <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
            avatar={<CompanyIcon sx={{ fontSize: 32 }} />}
            title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Profil Perusahaan</Typography>}
            subheader="Kelola informasi perusahaan Anda"
            sx={{ backgroundColor: 'secondary.light' }}
        />
        <CardContent>
            {!initialProfile?.company_name && <Alert severity="warning" sx={{ mb: 2 }}> Harap lengkapi profil perusahaan Anda. </Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField label="Nama Perusahaan" value={companyName} onChange={e => setCompanyName(e.target.value)} required fullWidth margin="dense" variant="outlined"/>
                <TextField label="Deskripsi Perusahaan" value={description} onChange={e => setDescription(e.target.value)} fullWidth margin="dense" multiline rows={3} variant="outlined"/>
                <TextField label="Website Perusahaan (Opsional)" value={website} onChange={e => setWebsite(e.target.value)} fullWidth margin="dense" variant="outlined"/>
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}> {loading ? 'Menyimpan...' : 'Simpan Profil'} </Button>
            </Box>
        </CardContent>
    </Card>
  );
}

// Komponen Utama Recruiter Dashboard
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
  const theme = useTheme(); // Tidak terpakai lagi? Hapus jika tidak perlu
  // const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Kita buat layout Grid saja

  async function fetchCompanyProfile() {
    setErrorProfile(''); setLoadingProfile(true);
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Gagal mengambil profil perusahaan');
      const data = await response.json();
      setCompanyProfile(data);
    } catch (err) { setErrorProfile(err.message); }
    finally { setLoadingProfile(false); }
  }

  async function fetchMyJobs(showLoading = true) { // Tambah parameter showLoading
    setErrorJobs('');
    if (showLoading) setLoadingJobs(true); // Hanya set loading jika diminta
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/jobs/my-company`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Gagal mengambil lowongan saya');
      const data = await response.json();
      setMyJobs(data);
    } catch (err) { setErrorJobs(err.message); }
    finally { if (showLoading) setLoadingJobs(false); } // Hanya set false jika dimulai true
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
    setErrorApplicants(''); setLoadingApplicants(true); setApplicants([]);
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/applications/recruiter/${jobId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Gagal mengambil data pelamar');
      const data = await response.json();
      setApplicants(data);
    } catch (err) { setErrorApplicants(err.message); }
    finally { setLoadingApplicants(false); }
  }

  const openReviewDialog = (applicant, newStatus) => {
    setReviewDialog({ open: true, applicant, newStatus });
  };

  const closeReviewDialog = () => {
    setReviewDialog({ open: false, applicant: null, newStatus: null });
  };

  async function handleReview(applicationId, newStatus) {
    // Tambahkan state loading khusus dialog
    setReviewDialog(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/applications/${applicationId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ new_status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengupdate status');
      alert(`Status lamaran berhasil diubah menjadi ${newStatus}`);
      closeReviewDialog();
      if (selectedJobId) { fetchApplicants(selectedJobId); } // Refresh pelamar
    } catch (err) {
      setErrorApplicants(err.message); // Tampilkan error di bawah tabel pelamar
      alert(`Error: ${err.message}`);
      setReviewDialog(prev => ({ ...prev, loading: false })); // Hentikan loading dialog jika error
    }
    // Tidak perlu finally, loading di-handle di closeReviewDialog atau catch
  }

  const getStatusChip = (status) => { /* ... (Fungsi Chip sama) ... */
     const statusConfig = { pending: { color: 'warning', label: 'Menunggu' }, viewed: { color: 'info', label: 'Dilihat' }, admin_review: { color: 'secondary', label: 'Review Admin' }, accepted: { color: 'success', label: 'Diterima' }, rejected: { color: 'error', label: 'Ditolak' } };
     const config = statusConfig[status] || { color: 'default', label: status };
     return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 500 }} />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Kolom 1: Forms */}
        <Grid item xs={12} lg={5}>
          {loadingProfile ? <CircularProgress /> : errorProfile ? <Alert severity="error">{errorProfile}</Alert> :
            <EditCompanyProfileForm initialProfile={companyProfile} onProfileUpdate={handleProfileUpdate} />
          }
          <AddJobForm refreshJobs={() => fetchMyJobs(false)} companyProfileExists={companyProfileExists} />
        </Grid>

        {/* Kolom 2: Job List & Applicants */}
        <Grid item xs={12} lg={7}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader
              title={ <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><WorkIcon sx={{ mr: 1 }} /> Lowongan Saya </Typography> }
              action={ <Tooltip title="Refresh lowongan"><IconButton onClick={() => fetchMyJobs(true)} disabled={loadingJobs}><RefreshIcon /></IconButton></Tooltip> }
              sx={{ backgroundColor: 'primary.light' }}
            />
            <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}> {/* Scrollable list */}
              {loadingJobs ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress /></Box> :
               errorJobs ? <Alert severity="error">{errorJobs}</Alert> :
               myJobs.length === 0 ? <Typography sx={{ textAlign: 'center', py: 2 }}>Belum ada lowongan.</Typography> :
                <List dense disablePadding> {/* dense & disablePadding */}
                  {myJobs.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <ListItem
                        button // Jadikan bisa diklik
                        selected={selectedJobId === job.id} // Highlight jika terpilih
                        onClick={() => { setSelectedJobId(job.id); fetchApplicants(job.id); }}
                        secondaryAction={ <Chip label={job.is_active ? 'Aktif' : 'Nonaktif'} color={job.is_active ? 'success' : 'default'} size="small" /> }
                      >
                        <ListItemText
                          primary={job.title}
                          secondary={`Dibuat: ${new Date(job.created_at).toLocaleDateString('id-ID')}`}
                        />
                      </ListItem>
                      {index < myJobs.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              }
            </CardContent>
          </Card>

          {/* Applicant Details */}
          {selectedJobId && (
            <Fade in={true} timeout={300}>
              <Card elevation={3}>
                 <CardHeader
                    title={ <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><PeopleIcon sx={{ mr: 1 }} /> Pelamar: {myJobs.find(j => j.id === selectedJobId)?.title || ''} </Typography> }
                    action={ <Tooltip title="Tutup"><IconButton onClick={() => setSelectedJobId(null)}><CloseIcon /></IconButton></Tooltip> }
                    sx={{ backgroundColor: 'secondary.light' }}
                 />
                 <CardContent>
                    {loadingApplicants ? <LinearProgress sx={{ my: 2 }} /> /* Linear progress */ :
                     errorApplicants ? <Alert severity="error">{errorApplicants}</Alert> :
                     applicants.length === 0 ? <Typography sx={{ textAlign: 'center', py: 2 }}>Belum ada pelamar.</Typography> :
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Pelamar</TableCell>
                                        <TableCell>Skills</TableCell>
                                        <TableCell>Bio Singkat</TableCell> {/* <<< TAMBAHKAN HEADER INI */}
                                        <TableCell>Gaji Diharapkan</TableCell> {/* <<< TAMBAHKAN HEADER INI */}
                                        <TableCell>Info Disabilitas</TableCell>
                                        <TableCell>CV</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applicants.map(applicant => (
                                    <TableRow key={applicant.application_id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.8rem' }}>{applicant.seeker_name?.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{applicant.seeker_name}</Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}><EmailIcon sx={{ fontSize: 12, mr: 0.5 }} />{applicant.seeker_email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>{/* <<< TAMBAHKAN CELL INI >>> */}
                                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          <Tooltip title={applicant.bio || ''}>
                                              <Typography variant="body2">{applicant.bio || '-'}</Typography>
                                          </Tooltip>
                                        </TableCell>

                                        <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {/* Batasi lebar */}
                                            <Tooltip title={applicant.skills?.join(', ') || ''}>
                                                <Typography variant="body2">{applicant.skills?.join(', ') || '-'}</Typography>
                                            </Tooltip>
                                        </TableCell>

                                        {/* <<< TAMBAHKAN CELL INI >>> */}
                                        <TableCell>
                                          {applicant.expected_salary ?
                                              `Rp ${applicant.expected_salary.toLocaleString('id-ID')}` : '-'}
                                        </TableCell>

                                        {/* <<< TAMBAHKAN CELL INI >>> */}
                                        <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <Tooltip title={applicant.disability_info || ''}>
                                                <Typography variant="body2">{applicant.disability_info || '-'}</Typography>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            {applicant.resume_filename ? (
                                                <Tooltip title="Lihat CV">
                                                    <IconButton size="small" href={`https://uas-konekin-backend-production.up.railway.app/api/resumes/${applicant.resume_filename}`} target="_blank" rel="noopener noreferrer"> <ResumeIcon /> </IconButton>
                                                </Tooltip>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>{getStatusChip(applicant.status)}</TableCell>
                                        <TableCell align="center">
                                            {/* --- LOGIKA TOMBOL DIPERBAIKI --- */}
                                            {(applicant.status === 'pending' || applicant.status === 'viewed') ? (
                                            <>
                                                <Tooltip title="Setujui & teruskan ke Admin">
                                                    <IconButton color="success" size="small" onClick={() => openReviewDialog(applicant, 'admin_review')}> <ApproveIcon /> </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Tolak Lamaran">
                                                    <IconButton color="error" size="small" onClick={() => openReviewDialog(applicant, 'rejected')}> <RejectIcon /> </IconButton>
                                                </Tooltip>
                                            </>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    { applicant.status === 'admin_review' ? 'Menunggu Admin' :
                                                      applicant.status === 'accepted' ? 'Diterima' :
                                                      applicant.status === 'rejected' ? 'Ditolak' : 'Direview'}
                                                </Typography>
                                            )}
                                            {/* ----------------------------- */}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                     }
                 </CardContent>
              </Card>
            </Fade>
          )}
        </Grid>
      </Grid>

      {/* Review Confirmation Dialog */}
      <Dialog open={reviewDialog.open} onClose={closeReviewDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            {reviewDialog.newStatus === 'admin_review' ? <ApproveIcon sx={{ mr: 1, color: 'success.main' }} /> : <RejectIcon sx={{ mr: 1, color: 'error.main' }} />}
             Konfirmasi Tindakan
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {reviewDialog.newStatus === 'admin_review' ? `Setujui lamaran dari ${reviewDialog.applicant?.seeker_name} dan teruskan ke admin?` : `Tolak lamaran dari ${reviewDialog.applicant?.seeker_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeReviewDialog}>Batal</Button>
          <Button
            onClick={() => handleReview(reviewDialog.applicant?.application_id, reviewDialog.newStatus)}
            variant="contained"
            color={reviewDialog.newStatus === 'admin_review' ? 'success' : 'error'}
            disabled={reviewDialog.loading} // Disable saat loading
            startIcon={reviewDialog.loading ? <CircularProgress size={16} color="inherit"/> : reviewDialog.newStatus === 'admin_review' ? <ApproveIcon /> : <RejectIcon />}
          >
            {reviewDialog.loading ? 'Memproses...' : reviewDialog.newStatus === 'admin_review' ? 'Setujui' : 'Tolak'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardRecruiter;