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
        // Use FormData if file is present
        if (cvFile) {
            const formData = new FormData();
            formData.append('trabajo_id', parseInt(trabajoId));
            formData.append('mensaje', mensaje);
            formData.append('cv_file', cvFile);
            // Ignore useProfileCv if file is provided, or send false explicitly
            return await api.post("/aplicaciones", formData);
        } else {
            // If requesting to use profile CV, we can send JSON or FormData (easier JSON unless mixed?)
            // Actually backend request allows mixed if we send JSON? No, backend expects 'hasFile' or boolean input.
            // If we send JSON: { "use_profile_cv": true }
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
