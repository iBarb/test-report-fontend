import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMutation } from '@tanstack/react-query';
import { FileText, HelpCircle, Loader2, Sparkles, Upload } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { CreateReport } from '../services/reportService';
import type { ReportCreate } from '../types/reporte';
import * as Yup from "yup";
import { useFormik } from 'formik';

interface ReportCreateProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string | undefined;
    refetch: () => void;
}

const ReportCreateDialog: React.FC<ReportCreateProps> = ({ open, onOpenChange, projectId, refetch }) => {
    const { token } = useSelector((state: any) => state.auth);

    const mutation = useMutation({
        mutationFn: (data: ReportCreate) => CreateReport(data, token, projectId),
        onSuccess: (data) => {
            console.log(data)
            onOpenChange(false);
            refetch();
        },
        onError: (error: any) => {
            console.log(error);
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage || "Error al crear el reporte");
        },
    });

    const formik = useFormik<ReportCreate>({
        initialValues: {
            title: "",
            prompt: "",
            file: undefined,
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Título requerido *"),
            prompt: Yup.string(),
            file: Yup.mixed().required("Archivo requerido *"),
        }),
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Crear Nuevo Reporte
                    </DialogTitle>
                    <DialogDescription>
                        Sube el archivo de pruebas y proporciona instrucciones para generar el reporte con IA
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Reporte *</Label>
                        <Input
                            id="title"
                            placeholder="Ej: Módulo de Login - Sprint 1"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            className="glass"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Archivo de Pruebas *</Label>
                        <div className="relative">
                            <Input
                                id="file"
                                type="file"
                                name="file"
                                onChange={(event) => {
                                    const file = event.currentTarget.files?.[0];
                                    formik.setFieldValue("file", file);
                                }}
                                required
                                className="glass cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                accept=".json,.xml,.csv,.txt"
                            />
                        </div>
                        {formik.values.file ? (
                            <p className="flex gap-1 items-center text-xs text-muted-foreground">
                                <Upload className="w-3 h-3" />
                                <span>{formik.values.file.name}</span>
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Formatos soportados: JSON, XML, CSV, TXT
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Contexto adicional (opcional)
                                </Label>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            className="max-w-sm p-4 space-y-3 glass"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-foreground">Información útil:</span>
                                                        <span className="text-muted-foreground"> versión del software, entorno (dev/staging/prod), navegador, sistema operativo, roles de usuario, configuraciones especiales.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <Textarea
                                id="prompt"
                                placeholder="Ej: Versión 2.1.0 en staging con Chrome 120. Prueba realizada con usuario admin. Base de datos migrada a PostgreSQL 15..."
                                value={formik.values.prompt}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={6}
                                className="glass resize-none text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                La IA generará automáticamente el Test Execution Log y los Test Incident Reports siguiendo la norma
                                ISO/IEC/IEEE 29119-3
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={mutation.isPending} className="flex-1 glow-hover">
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generando reporte con IA...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generar Reporte
                                </>
                            )}
                        </Button>
                        <Button type="button" variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
};

export default ReportCreateDialog;