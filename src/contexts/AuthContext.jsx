import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// Utilidad pura fuera del componente para mejor rendimiento y testabilidad
const getParsedToken = (token) => {
  try {
    const claims = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Si el token ya expiró, retornamos null
    if (claims.exp < currentTime) return null;

    return {
      id: claims.sub || claims.user_id,
      username: claims.username || claims.name || claims.email?.split('@')[0],
      email: claims.email,
      role: claims.role || 'user',
      exp: claims.exp,
    };
  } catch (error) {
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ESTADO INICIAL LAZY: Ejecuta la logica de recuperacion solo una vez al montar
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    return token ? getParsedToken(token) : null;
  });

  const logout = useCallback((expired = false) => {
    localStorage.removeItem("access_token");
    setUser(null);
    
    // Si la sesión expiró añadimos un flag a la URL para que Login.jsx lo detecte
    const redirectUrl = expired ? "/login?expired=true" : "/login";
    
    if (!window.location.pathname.includes("/login")) {
      navigate(redirectUrl, { replace: true });
    }
  }, [navigate]);

  const login = useCallback((token) => {
    const userData = getParsedToken(token);
    if (userData) {
      localStorage.setItem("access_token", token);
      setUser(userData);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // GESTIÓN DE EXPIRACIÓN Y SINCRONIZACIÓN
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    let logoutTimer;

    const handleSession = () => {
      if (token) {
        const userData = getParsedToken(token);
        if (userData) {
          // BUFFER: Logout 10 segundos antes de la expiración real para evitar fallos de API
          const timeLeft = (userData.exp * 1000) - Date.now() - 10000;
          
          if (timeLeft > 0) {
            logoutTimer = setTimeout(() => logout(true), timeLeft);
          } else {
            logout(true);
          }
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    handleSession();

    // Sincronización entre pestañas (Tab Sync)
    const syncLogout = (event) => {
      if (event.key === "access_token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("storage", syncLogout);
    
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      window.removeEventListener("storage", syncLogout);
    };
  }, [logout]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user && (user.exp * 1000 > Date.now()),
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    loading
  }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}