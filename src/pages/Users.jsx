import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import {
  Container, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography,
  Chip, Box, LinearProgress, Alert, Tooltip, Avatar, Fade
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// Configuración de roles centralizada
const ROLE_CONFIG = {
  admin: { color: "error", label: "ADMINISTRADOR", description: "Acceso total al sistema" },
  moderator: { color: "warning", label: "MODERADOR", description: "Gestión de contenidos" },
  user: { color: "info", label: "USUARIO", description: "Acceso estándar" }
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      Swal.fire({
        title: "Error de Protocolo",
        text: "No se pudo sincronizar la lista de usuarios con la base de datos central.",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadUsers();
    }
  }, [currentUser, loadUsers]);

  const handleDelete = async (userId, username) => {
    if (Number(userId) === Number(currentUser?.id)) {
      Swal.fire("Acción Restringida", "Por seguridad, no es posible revocar tu propia cuenta administrativa.", "info");
      return;
    }

    const result = await Swal.fire({
      title: `¿Confirmar baja de ${username}?`,
      text: "Esta acción revocará accesos y eliminará los registros vinculados permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Confirmar Baja",
      cancelButtonText: "Abortar"
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      Swal.fire("Sincronizado", "El usuario ha sido removido del sistema.", "success");
    } catch (err) {
      Swal.fire("Fallo Operativo", "No se pudo completar la solicitud de baja.", "error");
    }
  };

  const handleChangeRole = async (userId, username, currentRole) => {
    if (Number(userId) === Number(currentUser?.id)) {
      Swal.fire("Protección de Cuenta", "Para modificar tus propios privilegios, solicita la intervención de otro administrador.", "warning");
      return;
    }

    const { value: newRole } = await Swal.fire({
      title: `Gestionar permisos: ${username}`,
      input: "select",
      inputOptions: {
        admin: "Administrador (Full Access)",
        moderator: "Moderador (Content Management)",
        user: "Usuario (Basic Access)",
      },
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonColor: "#ed6c02",
      inputValidator: (value) => !value && "Debe seleccionar un rol corporativo válido",
    });

    if (!newRole || newRole === currentRole) return;

    try {
      await api.patch(`/api/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      Swal.fire("Privilegios Actualizados", `Nivel de acceso escalado a ${newRole}.`, "success");
    } catch (err) {
      Swal.fire("Error de Actualización", "No se pudieron reasignar los permisos.", "error");
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Acceso Denegado: Su cuenta no posee privilegios administrativos para este módulo.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Fade in={true}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2.5 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={900} letterSpacing="-1px">
                Directorio de Usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Panel de control de acceso y gestión de identidades corporativas.
              </Typography>
            </Box>
          </Box>

          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)", 
              borderRadius: 4, 
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {loading && <LinearProgress sx={{ height: 4 }} />}
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, py: 2.5 }}>USUARIO</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>EMAIL CORPORATIVO</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>ESTATUS / ROL</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>GESTIÓN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => {
                  const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                  return (
                    <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: u.role === 'admin' ? 'error.light' : 'primary.light', 
                            fontWeight: 800, 
                            fontSize: '0.8rem',
                            width: 32, height: 32
                          }}>
                            {u.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography fontWeight={700} color="text.primary">{u.username}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{u.email}</TableCell>
                      <TableCell>
                        <Tooltip title={role.description} arrow>
                          <Chip 
                            label={role.label} 
                            color={role.color} 
                            size="small" 
                            sx={{ fontWeight: 900, fontSize: '0.65rem', borderRadius: 1.5 }} 
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                          <Button
                            variant="text"
                            color="warning"
                            size="small"
                            startIcon={<ManageAccountsIcon />}
                            onClick={() => handleChangeRole(u.id, u.username, u.role)}
                            sx={{ fontWeight: 800, textTransform: 'none' }}
                          >
                            Permisos
                          </Button>
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            startIcon={<DeleteForeverIcon />}
                            onClick={() => handleDelete(u.id, u.username)}
                            sx={{ fontWeight: 800, textTransform: 'none' }}
                          >
                            Dar de baja
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {!loading && users.length === 0 && (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                  No se han encontrado registros en el directorio.
                </Typography>
              </Box>
            )}
          </TableContainer>
        </Box>
      </Fade>
    </Container>
  );
}