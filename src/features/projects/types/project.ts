export interface Project {
    project_id: number;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
}

export interface ProjectCreate {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: "Planificado" | "En progreso" | "Completado";
}