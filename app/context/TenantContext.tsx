"use client";

import React, { createContext, useContext } from "react";

// 1. Creamos el contexto con un valor inicial vacío
const TenantContext = createContext<{ tenantId?: string }>({});

// 2. Definimos el Provider
export const TenantProvider = ({ tenantId, children }: { tenantId?: string; children: React.ReactNode }) => {
    return (
        <TenantContext.Provider value={{ tenantId }}>
            {children}
        </TenantContext.Provider>
    );
};

// 3. Creamos un hook para acceder fácilmente al contexto
export const useTenant = () => useContext(TenantContext);
