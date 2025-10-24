import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FolderPlus, Loader2 } from 'lucide-react';
import React from 'react';
import type { ProjectCreate } from '../types/project';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useMutation } from '@tanstack/react-query';
import { CreateProject } from '../services/projectService';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

interface ProjectCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}

const ProjectCreateDialog: React.FC<ProjectCreateDialogProps> = ({ open, onOpenChange, refetch }) => {
    const { token } = useSelector((state: any) => state.auth);

    const mutation = useMutation({
        mutationFn: (data: ProjectCreate) => CreateProject(data, token),
        onSuccess: (data) => {
            console.log(data);
            toast.success("Proyecto creado exitosamente");
            onOpenChange(false);
            refetch();
        },
        onError: (error: any) => {
            console.log(error);
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage || "Error al crear el proyecto");
        },
    });

    const formik = useFormik<ProjectCreate>({
        initialValues: {
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            status: "Planificado",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nombre requerido *"),
            description: Yup.string().max(500, "Máximo 500 caracteres *"),
            start_date: Yup.date()
                .required("Fecha de inicio requerida *")
                .typeError("Fecha de inicio inválida *")
                .when("end_date", (end_date, schema) =>
                    end_date
                        ? schema.max(
                            end_date,
                            "La fecha de inicio no puede ser posterior a la fecha de fin *"
                        )
                        : schema
                ),
            end_date: Yup.date()
                .required("Fecha de fin requerida *")
                .typeError("Fecha de fin inválida *")
                .min(
                    Yup.ref("start_date"),
                    "La fecha de fin no puede ser anterior a la fecha de inicio *"
                ),
            status: Yup.string().required("Estado requerido *"),
        }),
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderPlus className="w-5 h-5" />
                        Crear Nuevo Proyecto
                    </DialogTitle>
                    <DialogDescription>
                        Define los detalles del proyecto para subir tus pruebas y automatizar los reportes
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Proyecto *</Label>
                        <Input
                            id="name"
                            placeholder="Ej: Sistema de Gestión de Inventarios"
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
                                placeholder="Describe el alcance y objetivos del proyecto de investigación..."
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
                            <Label htmlFor="start_date">Fecha de Inicio *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={formik.values.start_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className={`glass ${formik.errors.start_date && formik.touched.start_date ? "!border-red-500" : ""}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Fecha de Fin *</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={formik.values.end_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
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
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando proyecto...
                                </>
                            ) : (
                                "Crear Proyecto"
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

export default ProjectCreateDialog;

