import Index from "views/admin/Dashboard.js";
import Profile from "views/profile.js";
import Register from "views/examples/Register.js";
import Login from "views/Login.js";
import Guru from "views/admin/GuruList.js";
import ReportTable from "views/admin/Laporan.js";
import Absensi from "views/guru/absensi";
import RequestLeave from "views/guru/izin";
import LeaveList from "views/admin/IzinList";
import LeaveListById from "views/guru/izinList";
import ReportTableById from "views/guru/absensiList";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Absensi />,
    layout: "/guru",
    roles: ["guru"],
  },
  {
    path: "/request-leave",
    name: "Pengajuan Izin",
    icon: "ni ni-single-copy-04 text-blue",
    component: <RequestLeave/>,
    layout: "/guru",
    roles: ["guru"],
  },
  {
    path: "/leave-list",
    name: "Daftar Izin",
    icon: "ni ni-bullet-list-67 text-orange",
    component: <LeaveListById/>,
    layout: "/guru",
    roles: ["guru"],
  },
  {
    path: "/absnesi-list",
    name: "Daftar Absensi",
    icon: "ni ni-bullet-list-67 text-orange",
    component: <ReportTableById/>,
    layout: "/guru",
    roles: ["guru"],
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    roles: ["admin"],
  },
  
  {
    path: "/guru",
    name: "Guru",
    icon: "ni ni-planet text-blue",
    component: <Guru />,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/leave-list",
    name: "Daftar Izin",
    icon: "ni ni-bullet-list-67 text-orange",
    component: <LeaveList/>,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/report",
    name: "Daftar Absensi",
    icon: "ni ni-bullet-list-67 text-orange",
    component: <ReportTable />,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/guru",
    roles: ["guru"],
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    roles: [""],
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
    roles: [""],
  },
];
export default routes;
