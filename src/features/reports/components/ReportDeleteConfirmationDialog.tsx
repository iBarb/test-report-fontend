import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DeleteReport } from '../services/reportService';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

interface ReportDeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportId: string;
    reportTitle: string;
    onSuccess: () => void;
}

const ReportDeleteConfirmationDialog: React.FC<ReportDeleteConfirmationDialogProps> = ({
    open,
    onOpenChange,
    reportId,
    reportTitle,
    onSuccess
}) => {
    const { token } = useSelector((state: any) => state.auth);

    const deleteMutation = useMutation({
        mutationFn: (data: { reportId: string }) =>
            DeleteReport(data.reportId, token),
        onSuccess: () => {
            toast.success('Reporte eliminado exitosamente');
            onSuccess();
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Error al eliminar el reporte');
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate({
            reportId
        });
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
                        ¿Estás seguro de que quieres eliminar el reporte <strong>"{reportTitle}"</strong>?
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={deleteMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="gap-2"
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportDeleteConfirmationDialog;
