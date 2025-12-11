# Jobify Frontend Client

Aplicación Single Page Application (SPA) desarrollada en React que sirve como interfaz de usuario para Jobify.

## 🛠 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Estilos:** CSS Modules / Vanilla CSS moderno.
- **Routing:** React Router DOM
- **Estado & Data:** Context API + Custom Hooks.
- **HTTP Client:** Fetch API (wrapper personalizado en `utils/api.js`).

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

- Node.js 18+
- NPM

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Variables de Entorno

Copiar el archivo de ejemplo y configurar la URL del backend.

```bash
cp .env.example .env
```

Asegúrate de que `VITE_API_URL` apunte a tu servidor backend (ej. `http://localhost:8000/api`).

### 4. Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto que asigne Vite).

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Vista previa de la build de producción.
- `npm run lint`: Ejecuta el linter (ESLint).

## 📂 Estructura Clave

- `src/components`: Componentes reutilizables (Botones, Tablas, Modales).
- `src/pages`: Componentes de página (Vistas completas).
- `src/layouts`: Componentes de estructura (Header, Sidebar).
- `src/services`: Funciones para realizar peticiones a la API.
- `src/contexts`: Estado global de la aplicación (Auth, UI).
- `src/utils`: Utilidades generales y configuración de API.

## ✨ Características Principales

- **Diseño Responsivo**: Adaptado a móviles y escritorio.
- **Gestión de Estado**: Manejo centralizado de sesión de usuario y preferencias.
- **Rutas Protegidas**: Control de acceso a páginas según autenticación y rol.
- **Componentes Modulares**: Arquitectura basada en componentes reutilizables.
