import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkAdminRole, navbarLinks } from "@/constants";

import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

import { cn } from "@/utils/cn";

import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            const isAdmin = await checkAdminRole();
            setIsAdmin(isAdmin);
        };

        fetchRole();
    }, []);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img
                    src="https://media.cakeresume.com/image/upload/s--1drzae5j--/c_pad,fl_png8,h_400,w_400/v1710759616/hgawfhkwohypdvdjkrnz.png"
                    alt="Logoipsum"
                    className="dark:hidden mx-auto h-10 w-auto"
                />
                <img
                    src="https://media.cakeresume.com/image/upload/s--1drzae5j--/c_pad,fl_png8,h_400,w_400/v1710759616/hgawfhkwohypdvdjkrnz.png"
                    alt="Logoipsum"
                    className="hidden dark:block mx-auto h-10 w-auto"
                />
                {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">SMK LETRIS INDONESIA 2</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "sidebar-item flex items-center p-2",
                                        isActive ? "bg-blue-500 text-white" : "",
                                        collapsed && "md:w-[45px]"
                                    )
                                }
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0 mr-2"
                                />
                                {!collapsed && <p className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
                {isAdmin && (
                    <nav className={cn("sidebar-group", collapsed && "md:items-center")}>
                        <NavLink
                            to="/dashboard/admin"
                            className={({ isActive }) =>
                                cn(
                                    "sidebar-item flex items-center p-2",
                                    isActive ? "bg-blue-500 text-white" : "",
                                    collapsed && "md:w-[45px]"
                                )
                            }
                        >
                            <span className="flex-shrink-0 mr-2">🛠️</span>
                            {!collapsed && <p className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">Admin Dashboard</p>}
                        </NavLink>
                    </nav>
                )}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};

//dah begadangnya, besok lanjut bikin video ya, kalau ada yang mau ditambahin palingan di rapihin aja UI nya sama di menngerti kodenya biar gak pusing