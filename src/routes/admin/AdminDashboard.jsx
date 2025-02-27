import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [newTagihan, setNewTagihan] = useState({ nama_tagihan: '', jumlah: '', id_user: '', tanggal_jatuh_tempo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('UID', user.id)
          .single();
        if (error || data.role !== 'admin') {
          navigate('/dashboard/home'); // Redirect if not admin
        }
      }
    };

    checkAdminRole();
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
    };

    fetchStudents();
  }, []);
    
  const handleAddTagihan = async () => {
    if (!newTagihan.id_user) {
      alert('Please select a student');
      return;
    }

    const { error: dbError } = await supabase
      .from('tagihan')
      .insert([
        {
          nama_tagihan: newTagihan.nama_tagihan,
          jumlah: newTagihan.jumlah,
          status: 'Pending', // Set default status
          tanggal_jatuh_tempo: new Date().toISOString().split('T')[0], // Contoh tanggal jatuh tempo
          id_user: newTagihan.id_user // Menggunakan id_user dari dropdown
        }
      ]);
    if (dbError) {
      alert('Ada kesalahan saat menambahkan tagihan: ' + dbError.message);
      return;
    }
    alert('Berhasil Menambahkan Tagihan');
    setNewTagihan({ nama_tagihan: '', jumlah: '', id_user: '', tanggal_jatuh_tempo: '' });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Tagihan</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nama Tagihan"
            className="p-2 border rounded"
            value={newTagihan.nama_tagihan}
            onChange={(e) => setNewTagihan({ ...newTagihan, nama_tagihan: e.target.value })}
          />
          <input
            type="number"
            placeholder="Jumlah"
            className="p-2 border rounded"
            value={newTagihan.jumlah}
            onChange={(e) => setNewTagihan({ ...newTagihan, jumlah: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={newTagihan.id_user}
            onChange={(e) => setNewTagihan({ ...newTagihan, id_user: e.target.value })}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.UID} value={student.UID}>
                {student.nama}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            onClick={handleAddTagihan}
          >
            Add Tagihan
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Student List</h2>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <li key={student.UID} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="shrink-0">
                  <img className="w-8 h-8 rounded-full" src={student.foto_profile} alt={`${student.nama} profile`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {student.nama}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {student.email}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {/* Anda dapat menambahkan informasi tambahan di sini */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard; 