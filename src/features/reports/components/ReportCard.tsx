import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { extraerConteo, getStatusColor } from '@/lib/utils';
import { AlertCircle, CheckCircle2, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';
import ReportDeleteConfirmationDialog from './ReportDeleteConfirmationDialog';

interface Report {
    report_id: string | number;
    title: string;
    status: string;
    created_at: string | Date;
    total_tests: number;
    failed_tests_count: number;
    duration: number;
    content: string;
}

interface ReportCardProps {
    report: Report;
    projectId: string;
    onRefetch: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
    report,
    projectId,
    onRefetch
}) => {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        reportId: string;
        reportTitle: string;
    }>({
        open: false,
        reportId: '',
        reportTitle: ''
    });

    const handleDeleteClick = (reportId: string, reportTitle: string) => {
        setDeleteDialog({
            open: true,
            reportId,
            reportTitle
        });
    };

    const handleDeleteSuccess = () => {
        setDeleteDialog({
            open: false,
            reportId: '',
            reportTitle: ''
        });
        onRefetch();
    };

    const isCompletado = report.status === "Completado";

    const cardContent = (
        <Card
            style={{
                viewTransitionName: `Report-view-${report.report_id}`
            }}
            className={`glass transition-all duration-300 ${isCompletado ? "hover:bg-card/80 cursor-pointer group" : "opacity-70 cursor-not-allowed"} !gap-4 !py-4`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className={`text-xl transition-colors mb-2 max-w-max`}
                            style={{
                                viewTransitionName: `Report-title-${report.report_id}`
                            }}
                        >
                            {report.title}
                        </CardTitle>
                        <CardDescription>
                            Creado el{" "}
                            {new Date(report.created_at).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                            {report.duration ? ` - ${report.duration / 1000} segundos` : ""}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(String(report.report_id), report.title)
                                }}>
                                    <Trash2 className="w-6 h-6 text-red-500" /> Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm">
                            <span className="font-medium">{extraerConteo(report.content)?.passed || 0}</span>
                            <span className="text-muted-foreground"> / {extraerConteo(report.content)?.totalExecutions || 0} tests exitosos</span>
                        </span>
                    </div>
                    {extraerConteo(report.content)?.failed > 0 && (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm">
                                <span className="font-medium text-red-400">{extraerConteo(report.content)?.failed}</span>
                                <span className="text-muted-foreground"> incidentes reportados</span>
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            {isCompletado ? (
                <Link to={`/projects/${projectId}/reports/${report.report_id}`} viewTransition>
                    {cardContent}
                </Link>
            ) : (
                <div>{cardContent}</div>
            )}

            <ReportDeleteConfirmationDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
                reportId={deleteDialog.reportId}
                reportTitle={deleteDialog.reportTitle}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
};

export default ReportCard;
