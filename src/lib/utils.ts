import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "En progreso":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Completado":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Planificado":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "Fallido":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export const getPermissionColor = (permission: string) => {
  switch (permission) {
    case "admin":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    case "editor":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "viewer":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const CONTEO_REGEX = /\[CONTEO\]\s*({[\s\S]*?})/;

export function extraerConteo(texto: string): Record<string, any> | null {
  const match = texto.match(CONTEO_REGEX);
  if (!match?.[1]) return null;

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.error("Error al parsear JSON:", error);
    return null;
  }
}

export function extraerConteoTotal(arrayDeObjetos: any[]): { totalExecutions: number; failed: number } {
  return arrayDeObjetos.reduce(
    (totales, obj) => {
      if (!obj.content) return totales;

      const conteo = extraerConteo(obj.content);
      if (!conteo) return totales;

      totales.totalExecutions += Number(conteo.totalExecutions || 0);
      totales.failed += Number(conteo.failed || 0);

      return totales;
    },
    { totalExecutions: 0, failed: 0 }
  );
}

// Función para extraer un objeto TEL
export function extractBlock<T = any>(text: string, tag: string): T | null {
  // Escapamos caracteres especiales por si la etiqueta tiene algo raro
  const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\[${safeTag}\\]\\s*(\\{[\\s\\S]*?\\})(?=\\s*\\[|$)`);
  const match = text.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error(`Error al parsear bloque [${tag}]:`, error);
    }
  }
  return null;
}


export function obtenerNombreMostrar(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(' ');

  // Si solo hay un nombre, devolver ese nombre
  if (partes.length === 1) {
    return partes[0];
  }

  // Si hay dos nombres, devolver ambos
  if (partes.length === 2) {
    return `${partes[0]} ${partes[1]}`;
  }

  // Si hay tres o más nombres, devolver los primeros dos
  return `${partes[0]} ${partes[1]}`;
}


export const withMinDelay = async <T,>(promise: Promise<T>, minDelay: number = 500): Promise<T> => {
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minDelay))
  ]);
  return result;
};