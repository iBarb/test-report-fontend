import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { ProjectCreate } from "../types/project";
import axiosInstance from "@/lib/axiosInstance";
import { withMinDelay } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL;

// Listar Proyectos
export const useProjects = () => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchProjects = async () => {
        const { data } = await axiosInstance.get(`${API_URL}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    return useQuery({
        queryKey: ["projects", token],
        queryFn: fetchProjects,
        enabled: !!token, // solo corre la query si hay token
        staleTime: 30 * 60 * 1000, // 30 minutos - evita refetch automático
        gcTime: 60 * 60 * 1000, // 60 minutos - mantiene datos en cache por 1 hora
    });
};


// Create Project
export const CreateProject = async (data: ProjectCreate, token: string) => {

    const response = await axiosInstance.post(`${API_URL}/projects`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Update Project
export const UpdateProject = async (
    id: string | number,
    data: ProjectCreate,
    token: string
) => {
    const response = await axiosInstance.put(`${API_URL}/projects/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


// Get Project by ID
export const useProjectById = (id: string | undefined) => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchProjectById = async () => {
        const fetchPromise = axiosInstance.get(`${API_URL}/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { data } = await withMinDelay(fetchPromise, 800);
        return data;
    };

    return useQuery({
        queryKey: ["project", id, token], // Include token in queryKey for re-fetching on token change
        queryFn: fetchProjectById,
        enabled: !!token && !!id, // solo corre la query si hay token e id
        retry: false, // No reintentar en caso de error
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache por 10 minutos
    });
};

// Delete Project
export const DeleteProject = async (projectId: string, token: string) => {
    const response = await axiosInstance.delete(`${API_URL}/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};