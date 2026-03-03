import { api } from '../utils/api';

export const gastoService = {
    getGastos: (params) => {
        const query = params ? new URLSearchParams(params).toString() : '';
        return api.get(`/gastos?${query}`);
    },
    getStats: (params) => {
        const query = params ? new URLSearchParams(params).toString() : '';
        return api.get(`/gastos/stats?${query}`);
    },
    createGasto: (data) => api.post('/gastos', data),
    updateGasto: (id, data) => api.put(`/gastos/${id}`, data),
    deleteGasto: (id) => api.delete(`/gastos/${id}`)
};
