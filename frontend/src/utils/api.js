const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, { method = "GET", body, token, headers = {} } = {}) {
    const config = {
        method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    };

    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const finalToken = token || storedToken;

    if (finalToken) {
        config.headers["Authorization"] = `Bearer ${finalToken}`;
    }

    if (body) {
        if (body instanceof FormData) {
            delete config.headers["Content-Type"];
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 413) {
        throw new Error("El archivo es demasiado grande. Por favor, sube un archivo más pequeño.");
    }

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        if (!response.ok) {
            throw new Error(response.statusText || "Error en la petición (Respuesta no legible)");
        }
        data = {}; 
    }

    if (!response.ok) {
        if (data.errors) {
            const firstError = Object.values(data.errors)[0][0];
            throw new Error(firstError || data.message || "Error en la petición");
        }
        throw new Error(data.message || "Error en la petición");
    }

    return data;
}

export const api = {
    get: (endpoint, token) => request(endpoint, { method: "GET", token }),
    post: (endpoint, body, token) => request(endpoint, { method: "POST", body, token }),
    put: (endpoint, body, token) => request(endpoint, { method: "PUT", body, token }),
    delete: (endpoint, token) => request(endpoint, { method: "DELETE", token }),
    getFileUrl: (path) => {
        if (!path) return '';
        
        // Hardcode domain to ensure absolute URL
        const domain = "http://92.190.194.223"; 

        // If it's already the correct domain, return it.
        if (path.startsWith(domain)) return path;
        
        // If it's an absolute URL
        if (path.startsWith('http')) {
             // If it contains /storage/, assume it's a misconfigured local URL (e.g. localhost) 
             // and try to fix it by extracting the relative path.
             if (path.includes('/storage/')) {
                 const relativePart = path.split('/storage/')[1];
                 return `${domain}/api/storage/${relativePart}`;
             }
             // Otherwise assume it's a valid external URL (e.g. placehold.co)
             return path;
        }
        
        let cleanPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Remove 'storage/' prefix if present
        if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.substring(8); 
        }
        
        return `${domain}/api/storage/${cleanPath}`;
    }
};
