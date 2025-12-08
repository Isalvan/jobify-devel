const API_URL = "http://92.190.194.223/api";

async function request(endpoint, { method = "GET", body, token, headers = {} } = {}) {
    const config = {
        method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    };

    const storedToken = localStorage.getItem('token');
    const finalToken = token || storedToken;

    if (finalToken) {
        config.headers["Authorization"] = `Bearer ${finalToken}`;
    }

    if (body) {
        if (body instanceof FormData) {
            // Let browser set Content-Type for multipart/form-data
            delete config.headers["Content-Type"];
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

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
};
