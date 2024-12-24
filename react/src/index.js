import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import GuruLayout from "layouts/Guru.js";

const isAuthenticated = () => {
  // Cek token dari localStorage
  return !!localStorage.getItem("token");
};

const getUserRole = () => {
  // Ambil role pengguna dari localStorage
  return localStorage.getItem("role"); // Pastikan role disimpan saat login
};

const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) {
    // Jika belum login, arahkan ke login
    return <Navigate to="/auth/login" replace />;
  }

  if (role && getUserRole() !== role) {
    // Jika role tidak sesuai, blok akses
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Rute untuk admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Rute untuk guru */}
      <Route
        path="/guru/*"
        element={
          <ProtectedRoute role="guru">
            <GuruLayout />
          </ProtectedRoute>
        }
      />

      {/* Rute untuk pengguna yang belum login */}
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Rute default jika tidak dikenal */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
);
