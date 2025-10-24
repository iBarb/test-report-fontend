import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditTeamMember } from '../services/teamService';
import { Check, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

interface InlinePermissionEditProps {
    projectId: string;
    userId: string;
    currentPermissions: 'admin' | 'editor' | 'viewer';
    onSuccess: () => void;
    onCancel: () => void;
}

const InlinePermissionEdit: React.FC<InlinePermissionEditProps> = ({
    projectId,
    userId,
    currentPermissions,
    onSuccess,
    onCancel
}) => {
    const { token } = useSelector((state: any) => state.auth);
    const [permissions, setPermissions] = useState<'admin' | 'editor' | 'viewer'>(currentPermissions);

    const editMutation = useMutation({
        mutationFn: (data: { projectId: string; userId: string; permissions: 'admin' | 'editor' | 'viewer' }) =>
            EditTeamMember(data, token),
        onSuccess: () => {
            toast.success('Permisos actualizados exitosamente');
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error al actualizar permisos');
        }
    });

    const handleSave = () => {
        if (permissions !== currentPermissions) {
            editMutation.mutate({
                projectId,
                userId,
                permissions
            });
        } else {
            onCancel();
        }
    };

    const handleCancel = () => {
        setPermissions(currentPermissions);
        onCancel();
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <Select value={permissions} onValueChange={(value: 'admin' | 'editor' | 'viewer') => setPermissions(value)}>
                <SelectTrigger className="w-full sm:w-40 glass">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin (Control total del proyecto)</SelectItem>
                    <SelectItem value="editor">Editor (Puede crear y editar reportes)</SelectItem>
                    <SelectItem value="viewer">Viewer (Solo lectura)</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex gap-1 w-full sm:w-auto justify-end sm:justify-start">
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={editMutation.isPending}
                    className="h-8 w-8 p-0"
                >
                    <Check className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={editMutation.isPending}
                    className="h-8 w-8 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default InlinePermissionEdit;
