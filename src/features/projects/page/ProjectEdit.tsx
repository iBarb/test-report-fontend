import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useMutation } from '@tanstack/react-query';
import { UpdateProject } from '../services/projectService';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import React from 'react';
import type { Project } from '../types/project';

interface ProjectEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
    refetch: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({ open, onOpenChange, project, refetch }) => {
    const { token } = useSelector((state: any) => state.auth);

    const mutation = useMutation({
        mutationFn: (data: any) => UpdateProject(project.project_id, data, token),
        onSuccess: () => {
            toast.success("Proyecto actualizado exitosamente");
            formik.resetForm();
            onOpenChange(false);
            refetch();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage || "Error al actualizar el proyecto");
        },
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: project?.name || "",
            description: project?.description || "",
            start_date: project?.start_date ? new Date(project.start_date).toISOString().split('T')[0] : "",
            end_date: project?.end_date ? new Date(project.end_date).toISOString().split('T')[0] : "",
            status: project?.status || "Planificado",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nombre requerido *"),
            description: Yup.string().max(500, "Máximo 500 caracteres *"),
            start_date: Yup.date()
                .typeError("Fecha de inicio inválida *")
                .when("end_date", (end_date, schema) =>
                    end_date ? schema.max(end_date, "La fecha de inicio no puede ser posterior a la fecha de fin *") : schema
                ),
            end_date: Yup.date()
                .typeError("Fecha de fin inválida *")
                .min(
                    Yup.ref("start_date"),
                    "La fecha de fin no puede ser anterior a la fecha de inicio *"
                ),
            status: Yup.string().required("Estado requerido *"),
        }),
        onSubmit: (values) => {
            const changedValues: Partial<typeof values> = {};

            Object.keys(values).forEach((key) => {
                const formikKey = key as keyof typeof values;
                if (values[formikKey] !== formik.initialValues[formikKey]) {
                    changedValues[formikKey] = values[formikKey];
                }
            });

            if (Object.keys(changedValues).length > 0) {
                mutation.mutate(changedValues);
            } else {
                toast.info("No se han realizado cambios.");
                onOpenChange(false);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Proyecto</DialogTitle>
                    <DialogDescription>Actualiza los detalles del proyecto</DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Proyecto *</Label>
                        <Input
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            className={`glass ${formik.errors.name && formik.touched.name ? "!border-red-500" : ""}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <div className="relative">
                            <Textarea
                                id="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                maxLength={500}
                                rows={4}
                                className={`glass resize-none ${formik.errors.description && formik.touched.description ? "!border-red-500" : ""}`}
                            />
                            <p className='text-xs right-0 pr-3 text-foreground/59 text-right'>
                                max 500 caracteres
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Fecha de Inicio</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={formik.values.start_date || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`glass ${formik.errors.start_date && formik.touched.start_date ? "!border-red-500" : ""}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Fecha de Fin</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={formik.values.end_date || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`glass ${formik.errors.end_date && formik.touched.end_date ? "!border-red-500" : ""}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                            value={formik.values.status}
                            onValueChange={(value) => {
                                formik.setFieldValue("status", value);
                                formik.setFieldTouched("status", true);
                            }}
                            required
                        >
                            <SelectTrigger className={`glass ${formik.errors.status && formik.touched.status ? "!border-red-500" : ""}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Planificado">Planificado</SelectItem>
                                <SelectItem value="En progreso">En progreso</SelectItem>
                                <SelectItem value="Completado">Completado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={mutation.isPending} className="flex-1 glow-hover">
                            {mutation.isPending ? (
                                <>Guardando...</>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectEditDialog;