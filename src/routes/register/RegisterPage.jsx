import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  supabase  from '../../config/supabaseClient.js'
import bcryptjs from 'bcryptjs'
const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [nis, setNis] = useState('');
    const [kelas, setKelas] = useState('');
    const [noTelepon, setNoTelepon] = useState("");
 
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
    
        // hash password
        let hashedPassword;
        try {
            hashedPassword = await bcryptjs.hash(password, 10);
        } catch (err) {
            setMessage('Gagal hash password');
            return;
        }
    
        // upload gambar
        let imageUrl = null;
        if (!file) {
            setMessage("File tidak boleh kosong");
            return;
        }
    
        let fileExt = file.name.split('.').pop();
        let fileName = `${Date.now()}.${fileExt}`;
        let { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('profile_pictures')
            .upload(fileName, file);
    
        if (uploadError) {
            setMessage('Gagal upload gambar');
            return;
        }
    
        imageUrl = supabase.storage.from('profile_pictures').getPublicUrl(fileName).data.publicUrl;
    
        // sign up user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: namaLengkap } }
        });
    
        if (signUpError) {
            setMessage(signUpError.message.includes("User already registered") ? 
                "Email sudah terdaftar, coba login." : signUpError.message);
            return;
        }
    
        if (!signUpData || !signUpData.user) {
            setMessage("Terjadi kesalahan, user tidak ditemukan.");
            return;
        }
    
        // semua berhasil, baru insert ke database
        const { error: dbError } = await supabase.from('users').insert([
            {
                UID: signUpData.user.id,
                role: 'siswa',
                password: hashedPassword,
                email,
                nis,
                nama: namaLengkap,
                kelas,
                no_telepon: noTelepon,
                foto_profile: imageUrl
            }
        ]);
    
        if (dbError) {
            setMessage('Gagal menyimpan data ke database');
            return;
        }
    
        setMessage('Registrasi berhasil! Silakan cek email untuk verifikasi.');
        navigate('/dashboard/home');
    };
        
    

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://media.cakeresume.com/image/upload/s--1drzae5j--/c_pad,fl_png8,h_400,w_400/v1710759616/hgawfhkwohypdvdjkrnz.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign up for an account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="namaLengkap" className="block text-sm/6 font-medium text-gray-900">Nama Lengkap</label>
                        <div className="mt-2">
                            <input type="text" name="namaLengkap" id="namaLengkap" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="nis" className="block text-sm/6 font-medium text-gray-900">NIS</label>
                        <div className="mt-2">
                            <input type="text" name="nis" id="nis" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={nis} onChange={(e) => setNis(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="kelas" className="block text-sm/6 font-medium text-gray-900">Kelas</label>
                        <div className="mt-2">
                            <input type="text" name="kelas" id="kelas" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={kelas} onChange={(e) => setKelas(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="noTelepon" className="block text-sm/6 font-medium text-gray-900">No Telepon</label>
                        <div className="mt-2">
                            <input type="text" name="noTelepon" id="noTelepon" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={noTelepon} onChange={(e) => setNoTelepon(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fotoProfile" className="block text-sm/6 font-medium text-gray-900">Foto Profile</label>
                        <div className="mt-2">
                            <input type="file" name="fotoProfile" id="fotoProfile" accept="image/*" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                </form>

                {message && <p className="mt-4 text-center text-sm/6 text-red-500">{message}</p>}

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already a member?
                    {' '}
                            <a href="#/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Login Now</a>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage