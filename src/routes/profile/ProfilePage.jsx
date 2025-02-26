import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../config/supabaseClient'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [profilePicture,setProfilePicture] =useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser()
      if (userData?.user) {
        setUser(userData.user)
        console.log("ad")
        console.log(userData.user)

        // Ambil informasi pengguna dari tabel 'users'
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('UID', userData.user.id)
          .single()
          console.log(data)

        if (!error) {
          setProfilePicture(data.foto_profile);
          setUserInfo(data)
        } else {
          console.error('Error fetching user info:', error.message)
        }
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      navigate('/UJIKOM_Web_pembayaran_tagihan_sekolah/')
    }
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-6">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-xl size-[100px] overflow-hidden rounded-full">
            <img
                        src={profilePicture}
                        alt="profile image"
                        className="size-full object-cover"
                    />
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{userInfo?.nama || 'Nama Pengguna'}</h1>
            <p className="text-gray-600">{userInfo?.kelas || 'Kelas'}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4" />

        {/* Contact Information */}
        <div className="text-gray-800">
          <p><span className="font-semibold">NIS:</span> {userInfo?.nis || 'NIS'}</p>
          <p><span className="font-semibold">Email:</span> {user?.email || 'Email'}</p>
        </div>

        {/* Divider */}
        <hr className="my-4" />

        {/* Additional Info */}
        <div className="text-gray-800">
          <p><span className="font-semibold">Join Date:</span> {new Date(user?.created_at).toLocaleString() || 'Tanggal Bergabung'}</p>
          <p><span className="font-semibold">Status:</span> {userInfo?.role || 'Status'}</p>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage