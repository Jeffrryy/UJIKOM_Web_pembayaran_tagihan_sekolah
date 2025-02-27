import { useTheme } from "@/hooks/use-theme";

import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";



import PropTypes from "prop-types";

import { useState,useEffect } from "react";
import supabase from '../config/supabaseClient.js'

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            // ambil user yg lagi login
            const { data: userData,error } = await supabase.auth.getUser();
            // console.log(userData.user.id)
            if (userData?.user) {
                setUser(userData.user);
                console.log(user)
                // ambil URL gambar dari database
                const { data, error } = await supabase
                    .from('users')
                    .select('foto_profile')
                    .eq('UID',userData.user.id)
                    .single();
//cari solve problem buat error baru ini, dimana gambar buat profile gak ada, untuk sekarang nangkepnya tuh karena id user nya gak nemu, jadi gak bisa ambil gambar profile nya
                if (!error) {
                    console.log("berhasil")
                    setProfilePicture(data.foto_profile);
                    console.log(data.foto_profile)
                } 
                if(error){
                    console.log(error.message)
                }
            }
        };

        fetchUser();
    }, []);
    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="size-10 overflow-hidden rounded-full">
                    <img
                        src={profilePicture}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
