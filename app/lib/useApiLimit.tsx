"use client";

import { useState, useEffect, useCallback } from "react";

// Configuración fácil de modificar
export const API_LIMIT_CONFIG = {
  MAX_REQUESTS_PER_DAY: 101, // Límite máximo de peticiones por día
  STORAGE_KEY: "capictive_api_usage", // Clave en localStorage
  WARNING_THRESHOLD: 20, // Mostrar advertencia cuando queden estas peticiones
  CRITICAL_THRESHOLD: 5, // Mostrar advertencia crítica
};

interface ApiUsageData {
  count: number;
  date: string; // Formato YYYY-MM-DD
}

interface UseApiLimitReturn {
  remainingRequests: number;
  canMakeRequest: boolean;
  consumeRequest: () => boolean;
  resetUsage: () => void;
  usagePercentage: number;
  isWarning: boolean;
  isCritical: boolean;
  isExhausted: boolean;
}

// Obtener la fecha actual en formato YYYY-MM-DD
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Obtener datos de uso del localStorage
const getUsageData = (): ApiUsageData => {
  if (typeof window === "undefined") {
    return { count: 0, date: getTodayDate() };
  }

  try {
    const stored = localStorage.getItem(API_LIMIT_CONFIG.STORAGE_KEY);
    if (stored) {
      const data: ApiUsageData = JSON.parse(stored);
      // Si es un nuevo día, reiniciar el contador
      if (data.date !== getTodayDate()) {
        return { count: 0, date: getTodayDate() };
      }
      return data;
    }
  } catch (error) {
    console.error("Error reading API usage data:", error);
  }

  return { count: 0, date: getTodayDate() };
};

// Guardar datos de uso en localStorage
const saveUsageData = (data: ApiUsageData): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(API_LIMIT_CONFIG.STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving API usage data:", error);
  }
};

// Hook principal para manejar el límite de API
export function useApiLimit(): UseApiLimitReturn {
  const [usageData, setUsageData] = useState<ApiUsageData>({ count: 0, date: getTodayDate() });

  // Cargar datos al montar
  useEffect(() => {
    const data = getUsageData();
    setUsageData(data);
  }, []);

  // Calcular peticiones restantes
  const remainingRequests = Math.max(0, API_LIMIT_CONFIG.MAX_REQUESTS_PER_DAY - usageData.count);
  const canMakeRequest = remainingRequests > 0;
  const usagePercentage = (usageData.count / API_LIMIT_CONFIG.MAX_REQUESTS_PER_DAY) * 100;
  const isWarning = remainingRequests <= API_LIMIT_CONFIG.WARNING_THRESHOLD && remainingRequests > API_LIMIT_CONFIG.CRITICAL_THRESHOLD;
  const isCritical = remainingRequests <= API_LIMIT_CONFIG.CRITICAL_THRESHOLD && remainingRequests > 0;
  const isExhausted = remainingRequests === 0;

  // Consumir una petición
  const consumeRequest = useCallback((): boolean => {
    const currentData = getUsageData();

    // Verificar si es un nuevo día
    if (currentData.date !== getTodayDate()) {
      const newData = { count: 1, date: getTodayDate() };
      saveUsageData(newData);
      setUsageData(newData);
      return true;
    }

    // Verificar si hay peticiones disponibles
    if (currentData.count >= API_LIMIT_CONFIG.MAX_REQUESTS_PER_DAY) {
      return false;
    }

    // Incrementar contador
    const newData = { ...currentData, count: currentData.count + 1 };
    saveUsageData(newData);
    setUsageData(newData);

    return true;
  }, []);

  // Reiniciar uso (para testing o admin)
  const resetUsage = useCallback((): void => {
    const newData = { count: 0, date: getTodayDate() };
    saveUsageData(newData);
    setUsageData(newData);
  }, []);

  return {
    remainingRequests,
    canMakeRequest,
    consumeRequest,
    resetUsage,
    usagePercentage,
    isWarning,
    isCritical,
    isExhausted,
  };
}

// Componente de notificación para mostrar el estado de las peticiones
export function ApiLimitNotification({
  remainingRequests,
  isWarning,
  isCritical,
  isExhausted,
  onSupportClick,
}: {
  remainingRequests: number;
  isWarning: boolean;
  isCritical: boolean;
  isExhausted: boolean;
  onSupportClick?: () => void;
}) {
  if (!isWarning && !isCritical && !isExhausted) return null;

  const bgColor = isExhausted
    ? "bg-red-500"
    : isCritical
    ? "bg-orange-500"
    : "bg-yellow-500";

  const message = isExhausted
    ? "Has agotado tus consultas de hoy"
    : isCritical
    ? `¡Solo te quedan ${remainingRequests} consultas!`
    : `Te quedan ${remainingRequests} consultas hoy`;

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse`}
    >
      <span className="text-xl">{isExhausted ? "🚫" : isCritical ? "⚠️" : "📊"}</span>
      <div>
        <p className="font-bold text-sm">{message}</p>
        {isExhausted && onSupportClick && (
          <button
            onClick={onSupportClick}
            className="text-xs underline hover:no-underline mt-1"
          >
            Apoyar al creador →
          </button>
        )}
      </div>
    </div>
  );
}
