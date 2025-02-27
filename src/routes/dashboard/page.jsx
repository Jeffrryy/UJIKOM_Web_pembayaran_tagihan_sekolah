import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users,FileText } from "lucide-react";
import supabase from "../../config/supabaseClient";
import { useState,useEffect } from "react";
const DashboardPage = () => {
    const { theme } = useTheme();
    const [totalTagihan, setTotalTagihan] = useState(0);
    const [user,setUser] = useState(null)
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
  const fetchTagihanJumlah = async () => {
    const { data: userData,error:errorUser } = await supabase.auth.getUser();
    // console.log(userData.user.id)
    if (userData?.user) {
        setUser(userData.user);
        console.log(user)
        // ambil URL gambar dari database
        const { data:dataTagihan, error } = await supabase
            .from('tagihan')
            .select('jumlah')
            .eq('id_user',userData.user.id)
            .eq('status', 'Pending'); // tambahin kondisi ini
            if (!error) {
                const total = dataTagihan.reduce((totalJumlah, tagihan) => totalJumlah + tagihan.jumlah, 0);
                console.log(dataTagihan)
                console.log(total)
                setTotalTagihan(total);
              }
              if(error){
                console.log("error")
                  console.log(error.message)
              }
    }
    const { data:dataTagihan, error:errorTagihan } = await supabase
      .from('tagihan')
      .select('*')
      .eq('id_user', userData.user.id); 
    if (errorTagihan) {
      console.error('Error fetching tagihan:', errorTagihan);
    } 
    if(!errorTagihan) {
      const updatedTagihan = dataTagihan.map(tagihan => {
        const today = new Date();
        const dueDate = new Date(tagihan.tanggal_jatuh_tempo);
        let denda = tagihan.denda || 0;

        if (today > dueDate && tagihan.status === 'Pending') {
          const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          denda = daysLate * 10000; // Contoh: denda Rp 10.000 per hari
        }

        return { ...tagihan, denda };
      });

      setTagihanList(dataTagihan);
      setTagihanList(updatedTagihan);
      console.log(dataTagihan)
    }
    
  };
  fetchTagihanJumlah();
}, []);
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard Siswa</h1>
            <div className="grid grid-cols-1 g\ md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center   ">
                    <div className="card-header flex items-center justify-center">
                        <div className="w-max rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-700 ">
                            <DollarSign size={40} />
                        </div>
                        <p className="card-title text-center text-4xl">Total Tagihan</p>
                    </div>
                    <div className="card-body  flex flex-col items-center justify-center gap-5">
                        <p className="text-6xl font-bold text-slate-900 transition-colors dark:text-slate-50">  Rp {totalTagihan.toLocaleString()}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>            </div>
            <div className="col grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overviewData}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `$${value}`}
                                />

                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `$${value}`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                
            <div className="card-header flex items-center justify-center">
                        <div className="w-max rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-700 ">
                            <FileText size={40} />
                        </div>
                        <p className="card-title text-center text-4xl">List Tagihan </p>
                    </div>
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
          </div>
        </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
