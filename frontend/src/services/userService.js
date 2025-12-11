import { api } from "../utils/api";

export const userService = {
    /**
     * Obtiene el perfil completo del usuario autenticado (incluye relación candidato/empresa).
     */
    async getProfile() {
        return await api.get('/user');
    },

    /**
     * Obtiene el perfil de un usuario específico por ID (público/protegido según backend).
     * @param {number} id 
     */
    async getUserProfile(id) {
        return await api.get(`/usuarios/${id}`);
    },

    /**
     * Actualiza los datos del usuario (tabla usuarios).
     * @param {number} id - ID del usuario
     * @param {Object} data - Datos a actualizar (nombre, email, telefono, etc)
     */
    async updateUser(id, data) {
        return await api.put(`/usuarios/${id}`, data);
    },

    /**
     * Actualiza los datos del candidato (tabla candidatos).
     * @param {number} id - ID del candidato
     * @param {Object} data - Datos a actualizar (apellidos, descripcion, ubicacion, etc)
     */
    async updateCandidato(id, data) {
        return await api.put(`/candidatos/${id}`, data);
    },

    /**
     * Actualiza los datos de la empresa.
     * @param {number} id 
     * @param {Object} data 
     */
    updateEmpresa: async (id, data) => {
        return await api.put(`/empresas/${id}`, data);
    },

    addCredits: async (empresaId, amount) => {
        return await api.post(`/empresas/${empresaId}/creditos`, { amount });
    },

    /**
     * Actualiza los datos del empleado.
     * @param {number} id 
     * @param {Object} data 
     */
    async updateEmpleado(id, data) {
        return await api.put(`/empleados/${id}`, data);
    },

    /**
     * Sube un CV para el perfil del candidato.
     * @param {number} candidatoId 
     * @param {File} file 
     */
    async uploadCV(candidatoId, file) {
        console.warn("Upload CV no implementado en backend para perfil aún.");
    },

    /**
     * Obtiene lista de usuarios (Admin only).
     */
    async getUsers() {
        return await api.get('/usuarios');
    },

    /**
     * Elimina un usuario (Admin only).
     * @param {number} id 
     */
    async deleteUser(id) {
        return await api.delete(`/usuarios/${id}`);
    }
};
