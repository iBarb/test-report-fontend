import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { ReportCreate, ReportHistoryEntry } from "../types/reporte";


const API_URL = import.meta.env.VITE_API_URL;


// Listar Reportes
export const useReportsByProjectId = (project_id: string | undefined) => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchReports = async () => {
        const { data } = await axiosInstance.get(`${API_URL}/reports/project/${project_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    return useQuery({
        queryKey: ["reports", project_id, token],
        queryFn: fetchReports,
        enabled: !!token && !!project_id, // solo corre la query si hay token y project_id
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache por 10 minutos
    });
};


// Crear Reporte
export const CreateReport = async (data: ReportCreate, token: string, projectId: string | undefined) => {
    const formData = new FormData();

    // Agregar campos al FormData
    if (data.file) formData.append("file", data.file); // debe ser un File o Blob
    if (data.title) formData.append("title", data.title);
    if (data.prompt) formData.append("prompt", data.prompt);

    const response = await axiosInstance.post(`${API_URL}/reports/upload/${projectId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // muy importante
        },
    });

    return response.data;
};

// Actualizar Reporte
export const UpdateReport = async (reportId: string, data: Partial<ReportCreate>, token: string, history_id: number | null, projectId: string | undefined) => {
    const formData = new FormData();

    // Agrega campos al FormData solo si existen
    if (data.title) formData.append("title", data.title);
    if (data.prompt) formData.append("prompt", data.prompt);
    // El archivo es opcional en la actualización
    if (data.file) formData.append("file", data.file);
    if (history_id) formData.append("history_id", history_id.toString());
    if (projectId) formData.append("project_id", projectId);

    const response = await axiosInstance.put(`${API_URL}/reports/${reportId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// Get Report by ID
export const useReportById = (id: string | undefined) => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchReportById = async () => {
        const { data } = await axiosInstance.get(`${API_URL}/reports/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    return useQuery({
        queryKey: ["report", id, token],
        queryFn: fetchReportById,
        enabled: !!token && !!id, // solo corre la query si hay token e id
        retry: false, // No reintentar en caso de error
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache por 10 minutos
    });
};

// Delete Report
export const DeleteReport = async (reportId: string, token: string) => {
    const response = await axiosInstance.delete(`${API_URL}/reports/${reportId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get Report History
export const useReportHistory = (reportId: string | undefined) => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchReportHistory = async (): Promise<ReportHistoryEntry[]> => {
        const { data } = await axiosInstance.get(`${API_URL}/reports/${reportId}/history`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    return useQuery({
        queryKey: ["report-history", reportId, token],
        queryFn: fetchReportHistory,
        enabled: !!token && !!reportId,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
    });
};