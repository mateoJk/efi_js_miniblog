# Enterprise Miniblog Frontend | High-Performance React Architecture 

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![MUI](https://img.shields.io/badge/UI--Library-Material--UI-007FFF?style=flat-square&logo=mui)](https://mui.com/)
[![PWA](https://img.shields.io/badge/Standards-PWA--Ready-663399?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

Interfaz de usuario de grado corporativo diseñada para la gestión de contenidos a gran escala. Esta plataforma actúa como el consumidor principal del **Professional Blog Engine API**, implementando patrones de diseño avanzados para garantizar la consistencia del estado y una seguridad robusta.

---

## 📑 Overview del Ecosistema

Este sistema es una **Single Page Application (SPA)** de alto rendimiento, diseñada bajo un modelo **Client-Server Architecture**. Orquesta un flujo de datos complejo mediante el consumo de una **RESTful API**, garantizando la integridad operativa a través de:

* **Stateless Authentication**: Ciclo de vida asíncrono mediante JWT (Bearer Token).
* **Dynamic RBAC Interface**: Adaptación en tiempo real de la UI basada en privilegios jerárquicos (Roles de usuario).
* **Atomic Data Sync**: Sincronización de estados entre el cliente y la persistencia del Backend.
* **Performance & SEO**: Configuración optimizada de activos estáticos y cumplimiento de estándares modernos de accesibilidad y PWA.

---

## 🏛️ Arquitectura del Cliente

### 🔹 Resilience Layer (Axios Core)
Gestión del ciclo de vida de peticiones mediante una capa de infraestructura resiliente:
* **Atomic Interceptors**: Inyección de identidad y normalización de headers en cada request.
* **Session Watchdog**: Manejo centralizado de errores `401 Unauthorized` con purga de estado y redirección inteligente para prevenir accesos inconsistentes.
* **Exponential Backoff**: Estrategia de reintentos automáticos ante fallos de red.

### 🔹 State & Identity Management (Context API)
Gestión del estado global mediante **Context API**, sincronizando el payload de los JWT decodificados con la reactividad de los componentes para un control de sesión en tiempo real.

### 🔹 Design System (MUI Enterprise Theming)
Arquitectura visual basada en un **ThemeProvider** centralizado que asegura consistencia mediante `CssBaseline`, tipografías normalizadas (Inter/Roboto) y un sistema de diseño escalable.

---

## 🔐 Control de Acceso basado en Roles (RBAC)

Implementación de seguridad granular distribuida:
* **Higher-Order Components (HOC)**: Blindaje de rutas mediante `ProtectedRoute` para roles Admin y Moderator.
* **Conditional Rendering**: Evaluación de permisos atómicos en el DOM para habilitar/deshabilitar operaciones de negocio.
* **Logic Hierarchy**: Soporte completo para flujos de trabajo segregados por niveles de autoridad.

---

## 🛠️ Stack Tecnológico
* **Frontend Core**: React 18+ | React Router DOM v6
* **UI Framework**: Material UI (MUI) con Custom ThemeProvider
* **Data Handling**: Axios | JWT-Decode
* **UX Components**: SweetAlert2 | React Toastify | PrimeIcons
* **Standards**: PWA (Manifest & Meta-tags) | ES6+ Coding Standards

---

## 📂 Estructura de Módulos

```
src/
├── api/          # Capa de infraestructura (Axios Client & Interceptors)
├── components/   # UI Atomics y HOCs de seguridad
├── contexts/     # Gestión de identidad y estado global
├── pages/        # Vistas modulares de negocio (CRUD, Admin, Auth)
├── theme/        # Definición del Design System (MUI Theme)
└── assets/       # Recursos estáticos y estilos globales
```
---

## ⚙️ Configuración del Entorno

### Requisitos
* **Node.js**: v16+
* **Backend API**: [Professional Blog Engine API](https://github.com/mateoJk/flask-blog-api-architecture)

### Instalación Rápida
```bash
# 1. Clonar el ecosistema
git clone [https://github.com/mateoJk/efi_js_miniblog](https://github.com/mateoJk/efi_js_miniblog)
cd efi_js_miniblog

# 2. Instalar dependencias core
npm install

# 3. Configurar entorno y ejecutar
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

## 💎 High-End Standards
* **SEO & Crawler Rules**: Implementación de robots.txt empresarial para protección de rutas administrativas.

* **PWA Ready**: Configuración avanzada de manifiesto y metadatos para optimización en dispositivos móviles.

* **Clean Architecture**: Separación estricta de responsabilidades (SoC) y modularización de componentes de alto impacto.