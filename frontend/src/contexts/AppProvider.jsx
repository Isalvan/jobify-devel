import { createContext, useEffect, useState } from "react";

// Creación del contexto
const AppContext = createContext();

function AppProvider({ children }) {
    return (
        <AppContext.Provider value={{}}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };