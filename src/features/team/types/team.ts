// Agregar Miembro al Equipo
export interface AddTeamMemberData {
    projectId: string;
    email: string;
    permissions: 'admin' | 'editor' | 'viewer';
}

// Editar Miembro del Equipo
export interface EditTeamMemberData {
    projectId: string;
    userId: string;
    permissions: 'admin' | 'editor' | 'viewer';
}

// Eliminar Miembro del Equipo
export interface DeleteTeamMemberData {
    projectId: string;
    userId: string;
}