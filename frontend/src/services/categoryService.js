import { api } from "../utils/api";

export const categoryService = {
    async getCategories() {
        return await api.get('/categorias');
    }
};
