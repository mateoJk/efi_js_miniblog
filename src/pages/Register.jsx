import React, { useState } from "react";
import { 
  Container, Box, Paper, Typography, TextField, 
  Button, IconButton, InputAdornment, CircularProgress, 
  Link as MuiLink, Fade, Avatar, MenuItem
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAddOutlined } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Expresión regular para validación de email (Estándar RFC 5322)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de Negocio (Business Logic)
    const { username, email, password, confirmPassword, role } = formData;

    if (!username.trim() || !email.trim() || !password) {
      return Swal.fire("Campos incompletos", "Todos los campos son obligatorios", "warning");
    }

    if (!emailRegex.test(email.trim())) {
      return Swal.fire("Email Inválido", "Por favor introduce un correo electrónico real", "error");
    }

    if (password.length < 6) {
      return Swal.fire("Seguridad débil", "La contraseña debe tener al menos 6 caracteres", "warning");
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error de coincidencia", "Las contraseñas no son iguales", "error");
    }

    if (loading) return;

    setLoading(true);
    try {
      // Payload sanitizado
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role
      };

      await api.post("/api/register", payload);

      await Swal.fire({
        icon: "success",
        title: "¡Registro Exitoso!",
        text: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        confirmButtonColor: "#2e7d32",
      });

      navigate("/login");
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "Error crítico en el servidor";
      Swal.fire("Fallo en el registro", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Fade in={true} timeout={800}>
        <Box sx={{ mt: 4, mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: 4, width: "100%", borderRadius: 4, textAlign: "center",
              border: '1px solid', borderColor: 'divider'
            }}
          >
            <Avatar sx={{ m: "0 auto 16px", bgcolor: 'success.main', width: 60, height: 60, boxShadow: 2 }}>
              <PersonAddOutlined fontSize="large" />
            </Avatar>

            <Typography variant="h4" fontWeight="800" letterSpacing={-0.5} gutterBottom>
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Únete a nuestra plataforma empresarial
            </Typography>

            <Box component="form" onSubmit={onSubmit} noValidate>
              <TextField
                margin="dense" required fullWidth label="Nombre de Usuario"
                name="username" autoComplete="username" autoFocus
                value={formData.username} onChange={handleChange} disabled={loading}
              />
              
              <TextField
                margin="dense" required fullWidth label="Email Corporativo"
                name="email" autoComplete="email"
                value={formData.email} onChange={handleChange} disabled={loading}
              />

              <TextField
                margin="dense" fullWidth select label="Asignar Rol"
                name="role" value={formData.role} onChange={handleChange} disabled={loading}
              >
                <MenuItem value="user">Usuario Final</MenuItem>
                <MenuItem value="moderator">Moderador</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </TextField>

              <TextField
                margin="dense" required fullWidth name="password" label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.password} onChange={handleChange} disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="dense" required fullWidth name="confirmPassword" label="Confirmar Contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword} onChange={handleChange} disabled={loading}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{ 
                  mt: 4, mb: 2, py: 1.8, borderRadius: 3, fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                }}
                color="success"
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : "Finalizar Registro"}
              </Button>

              <Typography variant="body2" sx={{ mt: 1 }}>
                ¿Ya eres miembro?{" "}
                <MuiLink component={Link} to="/login" sx={{ fontWeight: '700', textDecoration: 'none' }}>
                  Identifícate
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}