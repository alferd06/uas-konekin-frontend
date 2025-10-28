import { useState } from 'react';

function AddMahasiswaForm({onDataAdded}) {
    const [nama, setNama] = useState("");
    const [npm, setNpm] = useState("");
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(event){
        event.preventDefault(); // event dicoret karen

        if (!nama || !npm){
            alert('tidak boleh kosong');
            return;
        }

        setLoading(true);

        const dataBaru = {
            nama: nama,
            npm: npm
        }

        try{
            const response = await fetch('http://localhost:3001/api/mahasiswa', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json', // untuk memberitahu bahwa 
                },
                body: JSON.stringify(dataBaru),
            });

            if (!response.ok){
                throw new Error('Gagal manambah siswa');
            }

            const hasil = await response.json();
            console.log('Siswa berhasil ditambahkan:', hasil);

            setNama("");
            setNpm("");
            onDataAdded();
        } catch (error){
            console.error(error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
    <form onSubmit={handleSubmit}>
      <h3>Tambah Mahasiswa Baru</h3>
      <div>
        <label>Nama: </label>
        <input 
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </div>
      <div>
        <label>NPM: </label>
        <input 
          type="text"
          value={npm}
          onChange={(e) => setNpm(e.target.value)}
        />
      </div>
      {/* Tombol akan 'disabled' (tidak bisa diklik) saat sedang loading */}
      <button type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}

export default AddMahasiswaForm;