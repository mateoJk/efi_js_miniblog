import React, { useState, useMemo, useCallback } from "react";
import { 
  AppBar, Box, Toolbar, IconButton, Typography, Menu, 
  Container, Avatar, Button, Tooltip, MenuItem, Divider, 
  ListItemIcon, Fade, useScrollTrigger, Chip
} from "@mui/material";
import { 
  Menu as MenuIcon, Logout, AccountCircle, 
  AdminPanelSettings, Category, Analytics, DashboardOutlined
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Configuración Inmutable - Evita Re-renders
const ICONS = {
  admin: <AdminPanelSettings fontSize="small" />,
  category: <Category fontSize="small" />,
  stats: <Analytics fontSize="small" />
};

const NAV_CONFIG = [
  { label: 'Posts', path: '/posts', iconKey: null, roles: ['user', 'moderator', 'admin'] },
  { label: 'Usuarios', path: '/users', iconKey: 'admin', roles: ['admin'] },
  { label: 'Categorías', path: '/categories', iconKey: 'category', roles: ['moderator', 'admin'] },
  { label: 'Estadísticas', path: '/stats', iconKey: 'stats', roles: ['moderator', 'admin'] },
];

/**
 * ElevationScroll: Maneja la transparencia y blur dinámico del header
 */
const ElevationScroll = ({ children }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      backgroundColor: trigger ? "rgba(255, 255, 255, 0.9)" : "background.default",
      backdropFilter: trigger ? "blur(12px)" : "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      borderBottom: (theme) => trigger ? "none" : `1px solid ${theme.palette.divider}`,
      color: "text.primary",
      zIndex: 1100,
      ...children.props.sx 
    }
  });
};

export default function NavbarTop() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleToggleNav = useCallback((e) => setAnchorElNav(e?.currentTarget || null), []);
  const handleToggleUser = useCallback((e) => setAnchorElUser(e?.currentTarget || null), []);

  const handleLogout = async () => {
    handleToggleUser(null);
    await logout();
    navigate("/login", { replace: true });
  };

  // RBAC (Role Based Access Control) Engine
  const visibleNavLinks = useMemo(() => {
    const role = user?.role || 'user';
    return NAV_CONFIG.filter(item => item.roles.includes(role));
  }, [user?.role]);

  const navButtonStyle = useCallback((path) => ({
    fontWeight: pathname === path ? 800 : 500,
    color: pathname === path ? 'primary.main' : 'text.secondary',
    textTransform: 'none',
    fontSize: '0.925rem',
    borderRadius: 2,
    px: 2,
    transition: '0.2s',
    '&:hover': { 
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      color: 'primary.main'
    }
  }), [pathname]);

  return (
    <ElevationScroll>
      <AppBar position="sticky" color="default">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 72 }}>
            
            {/* LOGO CORPORATIVO */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                mr: 4, display: 'flex', fontWeight: 900, 
                color: 'primary.main', textDecoration: 'none',
                letterSpacing: '-1.2px',
                fontSize: '1.4rem',
                '&:hover': { opacity: 0.85 }
              }}
            >
              MINIBLOG<Box component="span" sx={{ color: 'text.primary', ml: 0.5 }}>PRO</Box>
            </Typography>

            {/* NAVIGATION MÓVIL (RBAC Aware) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton onClick={handleToggleNav} color="inherit" edge="start">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => handleToggleNav(null)}
                TransitionComponent={Fade}
                PaperProps={{ sx: { minWidth: 240, borderRadius: 3, mt: 1 } }}
              >
                {visibleNavLinks.map((link) => (
                  <MenuItem 
                    key={link.path} 
                    onClick={() => handleToggleNav(null)}
                    component={Link} 
                    to={link.path}
                    selected={pathname === link.path}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    <ListItemIcon>{ICONS[link.iconKey] || <DashboardOutlined fontSize="small" />}</ListItemIcon>
                    {link.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* NAVIGATION DESKTOP */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {visibleNavLinks.map((link) => (
                <Button 
                  key={link.path}
                  component={Link} 
                  to={link.path} 
                  startIcon={ICONS[link.iconKey]}
                  sx={navButtonStyle(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* USER PROFILE / AUTH SECTION */}
            <Box sx={{ flexGrow: 0 }}>
              {!isAuthenticated ? (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button 
                    component={Link} 
                    to="/login" 
                    variant="text" 
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained" 
                    disableElevation 
                    sx={{ borderRadius: 2.5, px: 3, fontWeight: 800, textTransform: 'none' }}
                  >
                    Empezar
                  </Button>
                </Box>
              ) : (
                <>
                  <Tooltip title="Mi Cuenta" arrow>
                    <IconButton onClick={handleToggleUser} sx={{ p: 0.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 40, 
                          height: 40, 
                          border: '2px solid', 
                          borderColor: 'background.paper',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                          fontSize: '1rem',
                          fontWeight: 800
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    sx={{ mt: '45px' }}
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={() => handleToggleUser(null)}
                    TransitionComponent={Fade}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ 
                      elevation: 0,
                      sx: { 
                        borderRadius: 3, 
                        minWidth: 220, 
                        mt: 1.5, 
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.12))',
                        border: '1px solid',
                        borderColor: 'divider'
                      } 
                    }}
                  >
                    <Box sx={{ px: 2.5, py: 2 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, fontSize: '1rem' }}>
                        {user?.username || 'Usuario'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {user?.email}
                      </Typography>
                      <Chip 
                        label={user?.role || 'user'} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                        sx={{ 
                          fontWeight: 900, 
                          fontSize: '0.65rem', 
                          textTransform: 'uppercase',
                          height: 20,
                          borderRadius: 1
                        }} 
                      />
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => handleToggleUser(null)} component={Link} to="/profile" sx={{ py: 1.5 }}>
                      <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                      <Typography variant="body2" fontWeight={600}>Mi Perfil</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                      <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                      <Typography variant="body2" fontWeight={700}>Cerrar Sesión</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}