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
    }
};
