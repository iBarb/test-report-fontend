import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DeleteProject } from '../services/projectService';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { queryClient } from '@/lib/queryClient';

interface ProjectDeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectTitle: string;
    onSuccess: () => void;
}

const ProjectDeleteConfirmationDialog: React.FC<ProjectDeleteConfirmationDialogProps> = ({
    open,
    onOpenChange,
    projectId,
    projectTitle,
    onSuccess
}) => {
    const { token } = useSelector((state: any) => state.auth);

    const deleteMutation = useMutation({
        mutationFn: (data: { projectId: string }) =>
            DeleteProject(data.projectId, token),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Proyecto eliminado exitosamente');
            onSuccess();
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error al eliminar el proyecto');
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate({ projectId });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        Confirmar Eliminación
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        ¿Estás seguro de que quieres eliminar el proyecto <strong>"{projectTitle}"</strong>?
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Esta acción no se puede deshacer y eliminará todos los reportes asociados.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="gap-2">
                        {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDeleteConfirmationDialog;