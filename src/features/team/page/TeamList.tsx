import { TabsContent } from '@radix-ui/react-tabs';
import React from 'react';
import { useSelector } from 'react-redux';
import TeamCreateModal from '../components/TeamCreateModal';
import TeamMemberCard from '../components/TeamMemberCard';

interface TeamListProps {
    data: any[];
    projectId: string;
    refetch: () => void;
}

const TeamList: React.FC<TeamListProps> = ({ data, projectId, refetch }) => {
    const { user: currentUser } = useSelector((state: any) => state.auth);

    // Encontrar el usuario actual en la lista de miembros para obtener sus permisos
    const currentUserMember = data.find(member =>
        currentUser && String(currentUser.id) === String(member.user.user_id)
    );

    // Solo los administradores pueden gestionar el equipo (agregar, editar, eliminar miembros)
    const canManageTeam = currentUserMember && currentUserMember.permissions === 'admin';

    return (
        <TabsContent value="team" className="space-y-4 animate-in fade-in-0 duration-300">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Miembros del Equipo</h2>
                {canManageTeam && <TeamCreateModal projectId={projectId} refetch={refetch} />}
            </div>

            <div className="space-y-4">
                {data.map((member, index) => (
                    <TeamMemberCard
                        key={member.project_user_id}
                        member={member}
                        index={index}
                        projectId={projectId}
                        canEditPermissions={canManageTeam}
                        onRefetch={refetch}
                    />
                ))}
            </div>
        </TabsContent>
    );
};

export default TeamList;