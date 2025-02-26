import { useContext } from "react";

import { ThemeProviderContext } from "@/contexts/theme-context";

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
// {isPaymentModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//     <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
//       <h2 className="text-lg font-bold mb-4">Pilih Tagihan</h2>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-300 p-2">Pilih</th>
//             <th className="border border-gray-300 p-2">Nama Tagihan</th>
//             <th className="border border-gray-300 p-2">Jumlah</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tagihanList.map((tagihan) => (
//             <tr key={tagihan.id}>
//               <td className="border border-gray-300 p-2 text-center">
//                 <input 
//                   type="checkbox" 
//                   checked={selectedTagihan.includes(tagihan)}
//                   onChange={() => toggleSelection(tagihan)}
//                 />
//               </td>
//               <td className="border border-gray-300 p-2">{tagihan.nama_tagihan}</td>
//               <td className="border border-gray-300 p-2">Rp {tagihan.jumlah.toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className='flex justify-end mt-4'>
//         <p className='text-lg font-bold'>Total Tagihan</p>
//         <p className='text-lg font-bold'>Rp {tagihanList.reduce((total, tagihan) => total + tagihan.jumlah, 0).toLocaleString()}</p>
//       </div>
//       <div className="flex justify-end mt-4">
        
//         <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsPaymentModalOpen(false)}>Batal</button>
//         <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handlePayment}>Bayar</button>
//       </div>
//     </div>
//   </div>
// )}
