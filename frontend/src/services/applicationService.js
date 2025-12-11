import { api } from "../utils/api";

export const applicationService = {
    /**
     * Aplica a una oferta de trabajo.
     * @param {number|string} trabajoId - ID del trabajo
     * @param {string} mensaje - Mensaje opcional del candidato
     * @param {File|null} cvFile - Archivo CV opcional
     * @param {boolean} useProfileCv - Flag para usar CV del perfil
     * @returns {Promise<Object>} Respuesta de la API
     */
    async applyToJob(trabajoId, mensaje = '', cvFile = null, useProfileCv = false) {
        if (cvFile) {
            const formData = new FormData();
            formData.append('trabajo_id', parseInt(trabajoId));
            formData.append('mensaje', mensaje);
            formData.append('cv_file', cvFile);
            return await api.post("/aplicaciones", formData);
        } else {
            const payload = {
                trabajo_id: parseInt(trabajoId),
                mensaje: mensaje,
                use_profile_cv: useProfileCv
            };
            return await api.post("/aplicaciones", payload);
        }
    },

    /**
     * Obtiene las aplicaciones del usuario (candidato).
     * @returns {Promise<Object>} Lista de aplicaciones
     */
    async getMyApplications() {
        return await api.get("/aplicaciones");
    },

    /**
     * Obtiene las aplicaciones para una oferta específica (empresa).
     * @param {number|string} trabajoId - ID del trabajo
     * @returns {Promise<Object>} Lista de aplicaciones
     */
    async getJobApplications(trabajoId) {
        return await api.get(`/aplicaciones?trabajo_id=${trabajoId}`);
    },

    /**
     * Actualiza el estado de una aplicación (empresa).
     * @param {number|string} id - ID de la aplicación
     * @param {string} estado - Nuevo estado (ACEPTADO, RECHAZADO, etc.)
     * @returns {Promise<Object>} Respuesta de la API
     */
    async updateStatus(id, estado) {
        return await api.put(`/aplicaciones/${id}`, { estado });
    },

    /**
     * Elimina una aplicación (Admin only).
     * @param {number} id 
     */
    async deleteApplication(id) {
        return await api.delete(`/aplicaciones/${id}`);
    }
};
