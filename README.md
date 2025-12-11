# Jobify Devel

Plataforma de búsqueda de empleo desarrollada con una arquitectura moderna de microservicios (monolito modular) utilizando Laravel y React.

## 🚀 Tech Stack

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React 18 + Vite
- **Database:** MySQL 8.0
- **Infrastructure:** Docker & Docker Compose
- **Server:** Nginx (Reverse Proxy)

## 📂 Estructura del Proyecto

```
jobify-devel/
├── backend/            # API Laravel
│   ├── app/
│   ├── database/
│   └── routes/
├── frontend/           # SPA React
│   ├── src/
│   └── public/
├── nginx/              # Configuración del servidor web
└── docker-compose.yml  # Orquestación de contenedores
```

## 🛠️ Instalación y Configuración

### Opción A: Docker (Recomendado)

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repo>
    cd jobify-devel
    ```

2.  **Variables de Entorno:**
    Copiar los archivos de ejemplo.

    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    cp .env-example .env
    ```

3.  **Levantar Contenedores:**

    ```bash
    docker-compose up -d --build
    ```

4.  **Configuración del Backend (dentro del contenedor):**

    ```bash
    docker-compose exec backend composer install
    docker-compose exec backend php artisan key:generate
    docker-compose exec backend php artisan migrate --seed
    docker-compose exec backend php artisan storage:link
    ```

5.  **Acceso:**
    - Web App: [http://localhost](http://localhost)
    - API: [http://localhost/api](http://localhost/api)

### Opción B: Desarrollo Local (Sin Docker)

**Requisitos:** PHP 8.2+, Composer, Node.js 18+, MySQL.

1.  **Backend:**

    ```bash
    cd backend
    cp .env.example .env
    composer install
    php artisan key:generate
    # Configurar DB en .env
    php artisan migrate --seed
    php artisan serve
    ```

2.  **Frontend:**
    ```bash
    cd frontend
    cp .env.example .env
    npm install
    npm run dev
    ```

## 🤝 Contribución

1.  Crear una rama para tu feature: `git checkout -b feature/mi-nueva-feature`
2.  Hacer commit de tus cambios: `git commit -m 'feat: Agrega nueva funcionalidad'`
3.  Push a la rama: `git push origin feature/mi-nueva-feature`
4.  Abrir un Pull Request.

## 📝 Licencia

Este proyecto es software open-source licenciado bajo la [MIT license](https://opensource.org/licenses/MIT).
