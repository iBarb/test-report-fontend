import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axiosInstance";
import type { AddTeamMemberData, EditTeamMemberData, DeleteTeamMemberData } from "../types/team";

const API_URL = import.meta.env.VITE_API_URL;

// Listar Miembros del Equipo
export const useTeamMembersByProjectId = (project_id: string | undefined) => {
    const { token } = useSelector((state: any) => state.auth);

    const fetchTeamMembers = async () => {
        const { data } = await axiosInstance.get(`${API_URL}/projects/${project_id}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    return useQuery({
        queryKey: ["teamMembers", project_id, token],
        queryFn: fetchTeamMembers,
        enabled: !!token && !!project_id, // solo corre la query si hay token y project_id
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache por 10 minutos
    });
};


export const AddTeamMember = async (data: AddTeamMemberData, token: string) => {
    const response = await axiosInstance.post(`${API_URL}/projects/${data.projectId}/users`, {
        email: data.email,
        permissions: data.permissions,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Editar Miembro del Equipo
export const EditTeamMember = async (data: EditTeamMemberData, token: string) => {
    const response = await axiosInstance.put(`${API_URL}/projects/${data.projectId}/users/${data.userId}`, {
        permissions: data.permissions,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Eliminar Miembro del Equipo
export const DeleteTeamMember = async (data: DeleteTeamMemberData, token: string) => {
    const response = await axiosInstance.delete(`${API_URL}/projects/${data.projectId}/users/${data.userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};