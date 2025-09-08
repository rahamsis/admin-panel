"use client";

import React, { createContext, useContext } from "react";

interface TenantContextProps {
    tenantId?: string;
    userId?: string;
}

const TenantContext = createContext<TenantContextProps | null>(null);

interface TenantProviderProps {
    tenantId?: string;
    userId?: string;
    children: React.ReactNode;
}

export const TenantProvider = ({ tenantId, userId, children }: TenantProviderProps) => {
    return (
        <TenantContext.Provider value={{ tenantId, userId }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error("useTenant debe usarse dentro de un TenantProvider");
    }
    return context;
};