import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import type { AddTeamMemberData } from '../types/team';
import { AddTeamMember } from '../services/teamService';
import { useSelector } from 'react-redux';

interface TeamCreateModalProps {
    projectId: string;
    refetch: () => void;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Ingresa un correo electrónico válido')
        .required('El correo electrónico es requerido'),
    permissions: Yup.string()
        .oneOf(['admin', 'editor', 'viewer'], 'Selecciona un tipo de permiso válido')
        .required('Los permisos son requeridos')
});

const TeamCreateModal: React.FC<TeamCreateModalProps> = ({ projectId, refetch }) => {
    const { token } = useSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: AddTeamMemberData) => AddTeamMember(data, token),
        onSuccess: (data) => {
            console.log(data)
            setOpen(false);
            refetch();
        }
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            permissions: 'editor' as 'admin' | 'editor' | 'viewer'
        },
        validationSchema,
        onSubmit: async (values) => {
            mutation.mutate({
                projectId,
                email: values.email.trim(),
                permissions: values.permissions
            });
        }
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            formik.resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 glow-hover">
                    <Plus className="w-4 h-4" />
                    Agregar Miembro
                </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus />
                        Agregar Miembro al Equipo
                    </DialogTitle>
                    <DialogDescription>
                        Sube el archivo de pruebas y proporciona instrucciones para generar el reporte con IA
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="usuario@ejemplo.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`glass ${formik.errors.email && formik.touched.email ? "!border-red-500" : ""}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="permissions">Permisos</Label>
                        <Select
                            value={formik.values.permissions}
                            onValueChange={(value: 'admin' | 'editor' | 'viewer') => formik.setFieldValue('permissions', value)}
                        >
                            <SelectTrigger className={`min-w-40 glass ${formik.errors.permissions && formik.touched.permissions ? "!border-red-500" : ""}`}>
                                <SelectValue placeholder="Seleccionar permisos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin (Control total del proyecto)</SelectItem>
                                <SelectItem value="editor">Editor (Puede crear y editar reportes)</SelectItem>
                                <SelectItem value="viewer">Viewer (Solo lectura)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || formik.isSubmitting}
                            className="flex-1 glow-hover"
                        >
                            {mutation.isPending || formik.isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Enviando invitación...
                                </>
                            ) : (
                                "Agregar Miembro"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={mutation.isPending || formik.isSubmitting}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TeamCreateModal;
