  import React, { useState, useEffect } from 'react'
  import { overviewData, recentSalesData, topProducts } from "@/constants";
  import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users,FileText} from "lucide-react";
  import supabase from '../../config/supabaseClient';



  const statusOptions = [
      { value: "Pending", label: "Pending" },
      { value: "Paid", label: "Paid" },
      { value: "Cancelled", label: "Cancelled" },
  ];

  const TagihanPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [newTagihan, setNewTagihan] = useState({ nama: '', jumlah: '', status: 'Pending'});
    const [message, setMessage] = useState('');
    const [selectedTagihan, setSelectedTagihan] = useState([]);
    const [userId, setUserId] = useState(null);
    const [tagihanList, setTagihanList] = useState([]);
    const [userInfo,setUserInfo] = useState(null)
    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) { 
          setUserInfo(user)
          setUserId(user.id);
        }
      };
      fetchUser();
      
    }, []);

   
    
    useEffect(() => {
      const fetchTagihan = async () => {
        const { data, error } = await supabase
          .from('tagihan')
          .select('*')
          .eq('id_user', userId)
          .neq('status', 'Paid'); // ambil semua KECUALI yang Paid
        if (error) {
          console.error('Error fetching tagihan:', error);
        } else {
            const updatedTagihan = data.map(tagihan => {
              const today = new Date();
              const dueDate = new Date(tagihan.tanggal_jatuh_tempo);
              let denda = tagihan.denda || 0;

              if (today > dueDate && tagihan.status === 'Pending') {
                const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                denda = daysLate * 10000; // Contoh: denda Rp 10.000 per hari
              }

              return { ...tagihan, denda };
            });

          setTagihanList(updatedTagihan);
          console.log(data)
        }
        
      };

      if (userId) {
        fetchTagihan();
      }
    }, [userId]);

    const handlePayment = () => {
      setIsPaymentModalOpen(false);
      setIsConfirmModalOpen(true);
    };
//IIZIN OFFFFF DAHHHH BISAAA AJGGG OWKWOWKOWKWOWOWWKOOWOWKO PENGEN LANJUT SAMPE BISA MAKE MIDTRANS DAN SEBAGAINYA EAKKKKK THANK YOU HARI INI KETUA IZIN PAMIT
    const handleConfirmPayment = async () => {
      
      if (selectedTagihan.length === 0) return;
      console.log("Selected Tagihan:", JSON.stringify(selectedTagihan, null, 2));
      const totalBayar = selectedTagihan.reduce((total, t) => total + t.jumlah, 0);

    
      // loop semua tagihan yang dipilih buat diupdate statusnya
      const updates = selectedTagihan.map(async (tagihan) => {
        const { data:dataTagihan,error:errorUpdate } = await supabase
          .from('tagihan')
          .update({ status: 'Paid' })
          .eq('id_tagihan', tagihan.id_tagihan);  
    
        if (errorUpdate) {
          console.error(`Gagal update tagihan ${tagihan.nama_tagihan}:`, errorUpdate.message);
        }
      });
      
      const { data: paymentData, error: paymentError } = await supabase
      .from('pembayaran')
      .insert([{ 
        nama_pembayar:userInfo.user_metadata.display_name,
        total_bayar: totalBayar,
          metode: 'transfer bank',
            tanggal_bayar: new Date().toISOString() }])
      .select()
      .single(); // tambahin .single() biar langsung ambil 1 objek
    
      const id_pembayaran = paymentData.id_pembayaran;
        
      const { data: kwitansiData, error: kwitansiError } = await supabase
        .from('kwitansi')
        .insert([{ 
          id_pembayaran,
          id_user:userInfo.id,
          nomor_kwitansi: `KW-${Date.now()}`, // contoh generate nomor kwitansi unik
          tanggal_bayar: new Date().toISOString(),
          jumlah: totalBayar,
          nama_kwitansi: `Pembayaran ${userInfo.user_metadata.display_name}`
        }]);
      
      if (kwitansiError) {
        console.error("Error saat insert kwitansi:", kwitansiError.message);
      }
      // tunggu semua update selesai
      await Promise.all(updates);
    
      // reset modal & refresh data tagihan
      setIsConfirmModalOpen(false);
      setSelectedTagihan([]);
      
      // fetch ulang buat nampilin update di UI
      const { data } = await supabase
        .from('tagihan')
        .select('*')
        .eq('id_user', userId)
        .neq('status', 'Paid'); // ambil semua KECUALI yang Paid
      setTagihanList(data);
    
      alert('Pembayaran berhasil untuk tagihan: ' + selectedTagihan.map(t => t.nama_tagihan).join(', '));
    };

    const toggleSelection = (tagihan) => {
      setSelectedTagihan((prev) => {
        if (prev.includes(tagihan)) {
          return prev.filter((t) => t !== tagihan);
        } else {
          return [...prev, tagihan];
        }
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage('');

      if (!userId) {
        setMessage('User tidak ditemukan. Silakan login kembali.');
        return;
      }

      const { error: dbError } = await supabase
        .from('tagihan')
        .insert([
          {
            nama_tagihan: newTagihan.nama,
            jumlah: newTagihan.jumlah,
            status: newTagihan.status,
            tanggal_jatuh_tempo: new Date().toISOString().split('T')[0], // Contoh tanggal jatuh tempo
            id_user: userId // Menambahkan id_user
          }
        ]);
        
      if (dbError) {
        setMessage('Ada kesalahan saat menambahkan tagihan: ' + dbError.message);
        return;
      }
      setMessage('Berhasil Menambahkan Tagihan');
      setIsModalOpen(false);
      // Refresh the tagihan list
      const { data } = await supabase
        .from('tagihan')
        .select('*')
        .eq('id_user', userId)
        .neq('status', 'Paid'); // ambil semua KECUALI yang Paid
      setTagihanList(data);
    };

    return (
      <div className="card">
        <div className="card-header py-3 rounded-lg ">
        
        
          <div className="w-max rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-700">
            <FileText size={40} />
          </div>
          <p className="card-title text-center text-4xl">Daftar Tagihan</p>
        
          </div>
          <div>
          {/* <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition
            pl"
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Tagihan
          </button> */}
          </div>
        
        <div className="card-body p-0">
          <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table h-[100px]">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">No</th>
                  <th className="table-head">Nama tagihan</th>
                  <th className="table-head">Jumlah</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Tanggal Jatuh Tempo</th>
                  <th className="table-head">Denda</th>
                
                </tr>
              </thead>
              <tbody className="table-body">
                {tagihanList.map((tagihan, index) => (
                  <tr key={tagihan.id} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{tagihan.nama_tagihan}</td>
                    <td className="table-cell">Rp {tagihan.jumlah.toLocaleString()}</td>
                    <td className={`table-cell ${tagihan.status === 'cancelled' ? 'text-red-500' : tagihan.status === 'Paid' ? 'text-green-500' : 'text-gray-500'}`}>{tagihan.status}</td>
                    <td className="table-cell">{tagihan.tanggal_jatuh_tempo.toLocaleString()}</td>
                    <td className="table-cell">Rp {tagihan.denda.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-4">
            <button className="bg-green-500 text-white px-6 py-3 text-lg rounded hover:bg-green-600 transition" onClick={() => setIsPaymentModalOpen(true)}>
              Bayar
            </button>
          </div>
        </div>

        {/* Modal untuk Tambah Tagihan */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Tambah Tagihan Baru</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nama Tagihan"
                  className="block w-full mb-2 p-2 border rounded"
                  value={newTagihan.nama}
                  onChange={(e) => setNewTagihan({ ...newTagihan, nama: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Jumlah"
                  className="block w-full mb-2 p-2 border rounded"
                  value={newTagihan.jumlah}
                  onChange={(e) => setNewTagihan({ ...newTagihan, jumlah: e.target.value })}
                />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={newTagihan.status}
                  onChange={(e) => setNewTagihan({ ...newTagihan, status: e.target.value })}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Tambah
                  </button>
                </div>
                {message && <p className="mt-4 text-center text-sm/6 text-red-500">{message}</p>}
              </form>
            </div>
          </div>
        )}
          
  {/* relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin] */}
    {isPaymentModalOpen && (
    <div className='card-body '>
  <div className="fixed inset-0 flex items-center justify-center pl-[70px] pt-[300px] bg-gray-900 bg-opacity-80  overflow-scroll  rounded-none [scrollbar-width:_thin] ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 ">
        <h2 className="text-lg font-bold mb-4">Pilih Tagihan</h2>
        <table className="w-full border-collapse border border-gray-300 "> 
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Pilih</th>
              <th className="border border-gray-300 p-2">Nama Tagihan</th>
              <th className="border border-gray-300 p-2">Jumlah</th>
              <th className="border border-gray-300 p-2">Denda</th>
            </tr>
          </thead>
          <tbody>
            
            {tagihanList.map((tagihan) => (
              <tr key={tagihan.id}>
                <td className="border border-gray-300 p-2 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedTagihan.includes(tagihan)}
                    onChange={() => toggleSelection(tagihan)}
                    className='id="react-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"'
                  />
                </td>
                <td className="border border-gray-300 p-2">{tagihan.nama_tagihan}</td>
                <td className="border border-gray-300 p-2">Rp {tagihan.jumlah.toLocaleString()}</td>
                <td className="border border-gray-300 p-2">Rp {tagihan.denda.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-col justify-center items-center mt-6'>
          <p className='text-lg font-bold '>Total Tagihan</p>
          <p className='text-lg font-bold'>Rp {selectedTagihan.reduce((total, tagihan,denda) => total + tagihan.jumlah + tagihan.denda, 0).toLocaleString()}</p>
        </div>
        <div className="flex justify-end mt-4">
          
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsPaymentModalOpen(false)}>Batal</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handlePayment}>Bayar</button>
        </div>
      </div>
    </div>
    </div>
  
  )}

        {/* Modal untuk Konfirmasi Pembayaran */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-scroll  pl-[70px] pt-[300px] ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Konfirmasi Pembayaran</h2>
              <p>Anda akan membayar tagihan berikut:</p>
            <table className='w-full border-collapse border border-gray-300'>
            <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Nama Tagihan</th>
              <th className="border border-gray-300 p-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            
            {selectedTagihan.map((selected,index) => (
              <tr key={selected.id}>
                  <td key={index} className='border border-gray-300 p-2'>{selected.nama_tagihan}</td>
                  <td key={index} className='border border-gray-300 p-2'>Rp {selected.jumlah.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
            </table>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  onClick={handleConfirmPayment}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  export default TagihanPage
