import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

// Componentes Core (Carga inmediata)
import NavbarTop from "./components/NavbarTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas con Code Splitting (Carga diferida para optimizar performance)
const PostList = lazy(() => import("./pages/PostsList"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const PostForm = lazy(() => import("./pages/PostForm"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Stats = lazy(() => import("./pages/Stats"));
const Categories = lazy(() => import("./pages/Categories"));
const Users = lazy(() => import("./pages/Users"));
const Profile = lazy(() => import("./pages/Profile"));

/**
 * Gestiona el ciclo de vida de las rutas, seguridad por roles y optimización de carga.
 */
function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavbarTop />
      
      {/* Suspense maneja el estado de carga mientras se descargan los chunks de las páginas */}
      <Suspense fallback={<LinearProgress color="primary" sx={{ height: 3 }} />}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostDetail />} />

            {/* RUTAS PROTEGIDAS - USUARIO ESTÁNDAR */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* RUTAS PROTEGIDAS - COLABORADORES (Posts) */}
            <Route 
              path="/posts/new" 
              element={
                <ProtectedRoute roles={["admin", "moderator", "user"]}>
                  <PostForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/posts/:postId/edit" 
              element={
                <ProtectedRoute roles={["admin", "moderator", "user"]}>
                  <PostForm />
                </ProtectedRoute>
              } 
            />

            {/* RUTAS PROTEGIDAS - GESTIÓN Y ADMINISTRACIÓN (RBAC) */}
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute roles={["admin", "moderator"]}>
                  <Categories />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stats" 
              element={
                <ProtectedRoute roles={["admin", "moderator"]}>
                  <Stats />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              } 
            />

            {/* FALLBACK: Redirección automática ante rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Suspense>
    </Box>
  );
}

export default App;