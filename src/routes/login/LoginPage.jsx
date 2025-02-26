import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient.js';
import bcryptjs from 'bcryptjs';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/#');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
       
        const { data, error } = await supabase.auth.signInWithPassword({
            email:email,
            password:password
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        if (data?.user) {
            setMessage('Login Success');
            navigate("/dashboard/home");
        }
    };
//lanjut gimana biar bisa navigatenya di github
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://media.cakeresume.com/image/upload/s--1drzae5j--/c_pad,fl_png8,h_400,w_400/v1710759616/hgawfhkwohypdvdjkrnz.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Log in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
                    </div>
                </form>

                {message && <p className="mt-4 text-center text-sm/6 text-red-500">{message}</p>}

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    {' '}
                    <button onClick={handleNavigate} className="font-semibold text-indigo-600 hover:text-indigo-500">Register now</button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage; 