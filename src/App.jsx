import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { useEffect } from "react";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import TagihanPage from "./routes/tagihan/TagihanPage";
import KuitansiPage from "./routes/kuitansi/KuitansiPage";
import ProfilePage from "./routes/profile/ProfilePage";
import RegisterPage from "./routes/register/RegisterPage";
import LoginPage from "./routes/login/LoginPage";
import { useNavigate } from "react-router-dom";

function App() {
    const router = createBrowserRouter([
        {
            path: "/UJIKOM_Web_pembayaran_tagihan_sekolah",
            element: <RegisterPage />,
        },
        {
            path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/login",
            element: <LoginPage />,
        },
        {
            path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/dashboard",
            element: <Layout />,
            children: [
                {
                    path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/dashboard/home",
                    element: <DashboardPage />,
                },
                {
                    path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/dashboard/Tagihan",
                    element: <TagihanPage />,
                },
                {
                    path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/dashboard/Kwitansi",
                    element: <KuitansiPage />,
                },
                {
                    path: "/UJIKOM_Web_pembayaran_tagihan_sekolah/dashboard/Profile",
                    element: <ProfilePage />,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
