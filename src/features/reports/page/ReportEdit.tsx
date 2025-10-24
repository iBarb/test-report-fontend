import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { FileText, HelpCircle, Loader2, Sparkles, Upload } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { UpdateReport } from '../services/reportService';
import type { Report, ReportCreate } from '../types/reporte';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReportEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    report: Report;
    refetch: () => void;
    selectedHistoryId: number | null;
    projectId: string | undefined;
}

const ReportEditDialog: React.FC<ReportEditDialogProps> = ({ open, onOpenChange, report, refetch, selectedHistoryId, projectId }) => {
    const { token } = useSelector((state: any) => state.auth);

    const mutation = useMutation({
        mutationFn: (data: any) => UpdateReport(report.report_id, data, token, selectedHistoryId, projectId),
        onSuccess: (data) => {
            if (data?.status === "Completado") {
                toast.success(data.message || "Reporte actualizado exitosamente.");
            }
            formik.resetForm();
            onOpenChange(false);
            refetch();
        },
    });

    const formik = useFormik<any>({
        enableReinitialize: true,
        initialValues: {
            title: report?.title || "",
            prompt: "",
            file: undefined,
        },
        validationSchema: Yup.object({
            title: Yup.string().optional(),
            prompt: Yup.string().optional(),
            file: Yup.mixed().optional(),
        }),
        onSubmit: (values) => {
            const changedValues: Partial<ReportCreate> = {};

            if (values.title !== formik.initialValues.title) {
                changedValues.title = values.title;
            }
            if (values.prompt !== formik.initialValues.prompt) {
                changedValues.prompt = values.prompt;
            }
            if (values.file) { // Si se sube un archivo, siempre es un cambio
                changedValues.file = values.file;
            }

            if (Object.keys(changedValues).length > 0) {
                mutation.mutate(changedValues);
            } else {
                toast.info("No se han realizado cambios.");
                onOpenChange(false);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Editar Reporte
                    </DialogTitle>
                    <DialogDescription>
                        Actualiza el título o las instrucciones. Si subes un nuevo archivo, el reporte se regenerará.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Nombre del Reporte</Label>
                        <Input
                            id="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            className={`glass ${formik.errors.title && formik.touched.title ? "!border-red-500" : ""}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Nuevo Archivo de Pruebas (Opcional)</Label>
                        <div className="relative">
                            <Input
                                id="file"
                                type="file"
                                name="file"
                                onChange={(event) => {
                                    const file = event.currentTarget.files?.[0];
                                    formik.setFieldValue("file", file);
                                }}
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
                                Sube un archivo solo si deseas regenerar el reporte con nuevos datos.
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
                                    Guardando y Regenerando...
                                </>
                            ) : (
                                "Guardar Cambios"
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

export default ReportEditDialog;