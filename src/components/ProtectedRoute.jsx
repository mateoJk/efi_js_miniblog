import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

// Gestiona: Autenticación, Autorización por Roles y Persistencia de Origen.

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Retornamos un contenedor centrado para mantener la consistencia visual
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  // 2. CONTROL DE AUTENTICACIÓN
  // Usamos isAuthenticated (valor derivado) para mayor claridad semántica
  if (!isAuthenticated) {
    // state={{ from: location }} es el estándar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. CONTROL DE AUTORIZACIÓN (RBAC - Role Based Access Control)
  if (roles.length > 0) {
    // Normalización de roles para evitar discrepancias de string
    const hasRequiredRole = roles.some(role => 
      user?.role?.toLowerCase() === role.toLowerCase()
    );

    if (!hasRequiredRole) {
      // Redirigir a una ruta segura
      return <Navigate to="/" replace state={{ unauthorized: true }} />;
    }
  }

  return children;
}