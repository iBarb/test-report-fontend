import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPermissionColor } from '@/lib/utils';
import { Crown, Edit, Mail, MoreVertical, Trash2, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import InlinePermissionEdit from './InlinePermissionEdit';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TeamMemberCardProps {
    member: any;
    index: number;
    projectId: string;
    canEditPermissions: boolean;
    onRefetch: () => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
    member,
    index,
    projectId,
    canEditPermissions,
    onRefetch
}) => {
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const [editingMember, setEditingMember] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        memberId: string;
        memberName: string;
    }>({
        open: false,
        memberId: '',
        memberName: ''
    });

    const handleEditStart = (memberId: string) => {
        setEditingMember(memberId);
        setShowOptions(false); // Ocultar opciones al iniciar edición
    };

    const handleEditCancel = () => {
        setEditingMember(null);
    };

    const handleEditSuccess = () => {
        setEditingMember(null);
        onRefetch();
    };

    const handleOptionsToggle = () => {
        setShowOptions(!showOptions);
    };

    const handleEditClick = () => {
        handleEditStart(member.project_user_id);
    };

    const handleDeleteClick = (memberId: string, memberName: string) => {
        setDeleteDialog({
            open: true,
            memberId,
            memberName
        });
    };

    const handleDeleteSuccess = () => {
        setDeleteDialog({
            open: false,
            memberId: '',
            memberName: ''
        });
        onRefetch();
    };

    const isOwner = index === 0; // el primero es el dueño
    const isSelf = currentUser && (String(currentUser.id) === String(member.user.user_id));

    return (
        <>
            <div className="relative overflow-hidden">
                <Card className="glass">
                    <CardContent>
                        <div className="flex flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    {isOwner && (
                                        <Crown className="absolute -top-1.5 right-1 rotate-12 w-4 h-4 text-yellow-500" />
                                    )}
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-lg truncate">{member.user.full_name}</h3>
                                        <Badge variant="outline" className={`capitalize text-xs ${getPermissionColor(member.permissions)}`}>
                                            {member.permissions}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{member.user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center sm:items-center gap-3">
                                {editingMember === member.project_user_id && canEditPermissions ? (
                                    <InlinePermissionEdit
                                        projectId={projectId}
                                        userId={member.user.user_id}
                                        currentPermissions={member.permissions}
                                        onSuccess={handleEditSuccess}
                                        onCancel={handleEditCancel}
                                    />
                                ) : (
                                    <>
                                        {(() => {
                                            // Solo mostrar opciones si:
                                            // 1. No es el propietario (primer miembro)
                                            // 2. No es el usuario actual
                                            // 3. El usuario actual tiene permisos para editar (es propietario o admin)
                                            if (isOwner || isSelf || !canEditPermissions) return null;

                                            return (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={handleOptionsToggle}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent className="w-56" align="end">
                                                        <DropdownMenuItem onClick={handleEditClick}>
                                                            <Edit className="w-6 h-6 text-blue-500" /> Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(member.user.user_id, member.user.full_name)}>
                                                            <Trash2 className="w-6 h-6 text-red-500" /> Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            );
                                        })()}
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Menú deslizante
                {(() => {
                    if (isOwner || isSelf || !canEditPermissions) return null;

                    return (
                        <div className={`absolute right-0 top-0 h-full max-w-max flex justify-end transition-transform duration-300 ease-out ${showOptions ? 'translate-x-0' : 'translate-x-full'
                            }`}>
                            <div className="flex h-full">

                                <button
                                    onClick={handleEditClick}
                                    className="bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center px-4 min-w-[80px] aspect-square transition-colors duration-200"
                                >
                                    <Edit className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">Editar</span>
                                </button>


                                <button
                                    onClick={() => handleDeleteClick(member.user.user_id, member.user.full_name)}
                                    className="bg-red-500 hover:bg-red-600 text-white flex flex-col items-center justify-center px-4 min-w-[80px] aspect-square transition-colors duration-200"
                                >
                                    <Trash2 className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">Eliminar</span>
                                </button>


                                <button
                                    onClick={handleOptionsToggle}
                                    className="bg-gray-500 hover:bg-gray-600 text-white flex flex-col items-center justify-center px-4 min-w-[80px] aspect-square transition-colors duration-200"
                                >
                                    <X className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">Cancelar</span>
                                </button>
                            </div>
                        </div>
                    );
                })()}
                    */}
            </div>

            <DeleteConfirmationDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
                projectId={projectId}
                userId={deleteDialog.memberId}
                userName={deleteDialog.memberName}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
};

export default TeamMemberCard;
