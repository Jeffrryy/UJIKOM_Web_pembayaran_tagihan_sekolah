import { createHashRouter, RouterProvider } from "react-router-dom";
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
    const router = createHashRouter([
        {
            path: "/",
            element: <RegisterPage />,
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/dashboard",
            element: <Layout />,
            children: [
                {
                    path: "home",
                    element: <DashboardPage />,
                },
                {
                    path: "Tagihan",
                    element: <TagihanPage />,
                },
                {
                    path: "Kwitansi",
                    element: <KuitansiPage />,
                },
                {
                    path: "Profile",
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
