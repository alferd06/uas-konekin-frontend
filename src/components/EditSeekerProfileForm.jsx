import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Input, // Untuk input file
    Link as MuiLink
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Ikon untuk tombol upload

function EditSeekerProfileForm() {
  // State untuk form fields
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState(''); // Simpan skills sebagai string dipisah koma
  const [expectedSalary, setExpectedSalary] = useState('');
  const [disabilityInfo, setDisabilityInfo] = useState('');
  const [currentResumeFilename, setCurrentResumeFilename] = useState(''); // Nama file resume saat ini
  const [selectedFile, setSelectedFile] = useState(null); // File yang baru dipilih

  // State untuk UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { token } = useAuth();

  // 1. Fetch data profil saat ini ketika komponen dimuat
  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;
      setLoadingProfile(true);
      setError('');
      try {
        const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/profile`, { // Ganti URL jika perlu
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal memuat profil');
        const data = await response.json();
        // Isi state form dengan data yang ada
        setBio(data.bio || '');
        setSkills(data.skills?.join(', ') || ''); // Ubah array skills jadi string
        setExpectedSalary(data.expected_salary || '');
        setDisabilityInfo(data.disability_info || '');
        setCurrentResumeFilename(data.resume_filename || ''); // Simpan nama file lama
      } catch (err) {
        setError('Gagal memuat data profil: ' + err.message);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [token]);

  // 2. Handler saat file dipilih
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Ambil file pertama yang dipilih
    setCurrentResumeFilename(''); // Hapus nama file lama jika file baru dipilih
  };

  // 3. Handler saat form disubmit
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // --- Gunakan FormData ---
    const formData = new FormData();
    formData.append('bio', bio);
    // Ubah string skills kembali jadi array sebelum dikirim (jika backend butuh array)
    // Atau kirim sebagai string jika backend bisa handle
    formData.append('skills', skills.split(',').map(s => s.trim()).filter(s => s)); // Kirim array
    formData.append('expected_salary', expectedSalary || null); // Kirim null jika kosong
    formData.append('disability_info', disabilityInfo);

    // Lampirkan file HANYA JIKA ada file baru yang dipilih
    if (selectedFile) {
      formData.append('resumeFile', selectedFile); // 'resumeFile' HARUS sama dengan di multer
    }
    // ----------------------

    try {
      const response = await fetch(`https://uas-konekin-backend-production.up.railway.app/api/profile`, { // Ganti URL jika perlu
        method: 'PUT',
        headers: {
          // JANGAN set 'Content-Type', browser akan otomatis mengaturnya untuk FormData
          'Authorization': `Bearer ${token}`
        },
        body: formData // Kirim FormData, bukan JSON
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan profil');

      setSuccess('Profil berhasil diperbarui!');
      setCurrentResumeFilename(data.resume_filename || ''); // Update nama file resume terbaru
      setSelectedFile(null); // Reset file yang dipilih

    } catch (err) {
      setError('Gagal menyimpan profil: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Edit Profil Pencari Kerja
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Bio Singkat"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          helperText="Ceritakan tentang diri Anda, pengalaman, atau tujuan karier."
        />
        <TextField
          label="Keahlian (Skills)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Pisahkan dengan koma, contoh: React, Node.js, Desain Grafis"
        />
        <TextField
          label="Gaji yang Diharapkan (per bulan, angka saja)"
          type="number"
          value={expectedSalary}
          onChange={(e) => setExpectedSalary(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Informasi Disabilitas (Opsional)"
          value={disabilityInfo}
          onChange={(e) => setDisabilityInfo(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          helperText="Jelaskan jika ada informasi relevan yang ingin Anda sampaikan."
        />

        {/* --- Input File untuk Resume --- */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body1" gutterBottom>
            Upload Resume/CV (Format PDF, Maks 5MB)
          </Typography>
          {/* Tampilkan nama file saat ini atau link jika ada */}
          {currentResumeFilename && !selectedFile && (
             <Typography variant="body2" sx={{ mb: 1 }}>
               Resume saat ini: {' '}
               <MuiLink href={`https://uas-konekin-backend-production.up.railway.app/api/resumes/${currentResumeFilename}`} target="_blank" rel="noopener noreferrer"> {/* Ganti URL jika perlu */}
                 {currentResumeFilename}
               </MuiLink>
            </Typography>
          )}
          {/* Tombol untuk memilih file */}
          <Button
            variant="outlined"
            component="label" // Membuat button berfungsi seperti label untuk input file
            startIcon={<UploadFileIcon />}
            sx={{ textTransform: 'none' }} // Agar teks tidak uppercase
          >
            Pilih File CV
            <Input
              type="file"
              hidden // Sembunyikan input file asli
              onChange={handleFileChange}
              accept=".pdf" // Hanya izinkan PDF
            />
          </Button>
          {/* Tampilkan nama file yang baru dipilih */}
          {selectedFile && (
            <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>
              File dipilih: {selectedFile.name}
            </Typography>
          )}
        </Box>
        {/* --- Akhir Input File --- */}

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Simpan Perubahan Profil'}
        </Button>
      </Box>
    </Paper>
  );
}

export default EditSeekerProfileForm;