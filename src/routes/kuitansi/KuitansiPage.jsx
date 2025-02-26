import React, { useEffect, useState } from 'react';
import { FileText } from "lucide-react";
import supabase from '../../config/supabaseClient';

const KuitansiPage = () => {
  const [kuitansiList, setKuitansiList] = useState([]);
  const [userInfo,setUserInfo] = useState(null)
  useEffect(() => {
    const fetchKuitansi = async () => {
      const { data: userData, error: errorUserData } = await supabase.auth.getUser();  
      if (userData?.user) {  // cek biar gak undefined
        setUserInfo(userData);
        const { data: dataKwitansi, error } = await supabase
          .from('kwitansi')
          .select('*')
          .eq('id_user', userData.user.id); // langsung pake userData.user.id
  
        if (error) {
          console.error('Error fetching kuitansi:', error);
        } else {
          setKuitansiList(dataKwitansi);
        }
      }
    };
    //CATATAN BIAR GAK LUPA. ITU KENAPA userInfo.user.id bukan userInfo.id karena didalam userInfo masih ada object jadi manggil user lagi biar masuk kedalem object lalu manggil lagi object id. dari pada bingung tanya chatgpt aja kenapa harus pake user.id lagi
    fetchKuitansi();
  }, []);

  return (
    <div className="card">
      <div className="card-header py-3 rounded-lg">
        <div className="w-max rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-700">
          <FileText size={40} />
        </div>
        <p className="card-title text-center text-4xl">Daftar Kuitansi</p>
      </div>
      <div className="card-body p-0">
        <div className="relative w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">No</th>
                <th className="table-head">No Kuitansi</th>
                <th className="table-head">Nama Kuitansi</th>
                <th className="table-head">Tanggal Bayar</th>
                <th className="table-head">Total Bayar</th>
                
              </tr>
            </thead>
            <tbody className="table-body">
              {kuitansiList.map((kuitansi, index) => (
                <tr key={kuitansi.id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{kuitansi.nomor_kwitansi}</td>
                  <td className="table-cell">{kuitansi.nama_kwitansi}</td>
                  <td className="table-cell">{new Date(kuitansi.tanggal_bayar).toLocaleString()}</td>
                  <td className="table-cell">Rp {kuitansi.jumlah}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default KuitansiPage;
