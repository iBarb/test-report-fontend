import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Calendar, ChevronDown, Download, Edit, FileText, List, Sparkles, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useReportById, useReportHistory } from '../services/reportService';
import type { ReportHistoryEntry } from '../types/reporte';
import ReportDetailSkeleton from '../components/ReportDetailSkeleton';
import { extractBlock, extraerConteo, getStatusColor } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestExecutionLogViewer from '../components/TestExecutionLogViewer';
import TestIncidentReportViewer from '../components/TestIncidentReportViewer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateCombinedReportPDF, generateSingleIncidentReportPDF, generateTestExecutionLogPDF, generateTestIncidentReportPDF } from '@/lib/pdf-generator';
import ReportEditDialog from './ReportEdit';
import { useTeamMembersByProjectId } from '@/features/team/services/teamService';
import { useSelector } from 'react-redux';


const ReportDefail: React.FC = () => {
    const { id, reportId } = useParams();
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false)
    const { data, isLoading, error: reportError, refetch } = useReportById(reportId);
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const { data: teamMembers } = useTeamMembersByProjectId(id);
    const { data: historyData, isLoading: isHistoryLoading } = useReportHistory(reportId);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null)
    // Auto-select current version when both data and history are loaded
    useEffect(() => {
        if (historyData && historyData.length > 0) {
            // Obtener el último elemento de la lista (más reciente)
            const lastHistoryId = historyData[0].history_id;
            setSelectedHistoryId(lastHistoryId);
        }
    }, [historyData]); // Mantengo selectedHistoryId por si se necesita resetear, pero la condición !selectedHistoryId previene el bucle

    // Redirigir si hay error al cargar el reporte (reporte no encontrado)
    useEffect(() => {
        if (reportError && !isLoading) {
            // Redirigir al proyecto si existe el ID del proyecto, sino a la lista de proyectos
            const redirectPath = id ? `/projects/${id}` : '/';
            navigate(redirectPath, { replace: true });
        }
    }, [reportError, isLoading, navigate, id]);

    const currentUserMember = teamMembers?.find((member: any) =>
        currentUser && String(currentUser.id) === String(member.user.user_id)
    );

    const userPermissions = currentUserMember?.permissions;
    const canEditReport = userPermissions === 'admin' || userPermissions === 'editor';


    if (isLoading) return <ReportDetailSkeleton />

    // Si no hay datos, no renderizar nada (la redirección se encargará)
    if (!data) return null;

    const selectedHistoryEntry = historyData?.find(h => h.history_id === selectedHistoryId);
    const reportContent = selectedHistoryEntry?.content || data?.content;

    const totalTests = extraerConteo(reportContent)?.totalExecutions;
    const passedTests = extraerConteo(reportContent)?.passed;
    const failedTests = extraerConteo(reportContent)?.failed;
    const incidents = extraerConteo(reportContent)?.incidents;
    const successRate = totalTests > 0 ? parseFloat(((passedTests / totalTests) * 100).toFixed(2)) : 0;


    const handleExportTEL = () => {
        console.log("Exporting TEL only")
        setIsExporting(true)
        try {
            const telData = extractBlock(reportContent, "TEL");
            if (telData) {
                generateTestExecutionLogPDF(telData, data?.title)
            } else {
                console.error("TEL block not found or invalid");
            }
        } catch (error) {
            console.error("Error generating TEL PDF:", error)
        } finally {
            setTimeout(() => setIsExporting(false), 1000)
        }
    }

    const handleExportAllTIR = () => {
        console.log("Exporting all TIR")
        setIsExporting(true)
        try {
            const tirData = extractBlock(reportContent, "TIR");
            if (tirData) {
                generateTestIncidentReportPDF(tirData, data?.title)
            } else {
                console.error("TIR block not found or invalid");
            }
        } catch (error) {
            console.error("Error generating TIR PDF:", error)
        } finally {
            setTimeout(() => setIsExporting(false), 1000)
        }
    }

    const handleExportSingleTIR = (incidentNumber: string) => {
        console.log("Exporting single TIR:", incidentNumber)
        setIsExporting(true)
        try {
            const tirData = extractBlock(reportContent, "TIR");
            const incident = tirData?.testIncidentReports?.find(
                (inc: any) => inc.generalInformation.incidentNumber === incidentNumber,
            )
            if (incident) {
                console.log("Found incident:", incident?.generalInformation?.incidentNumber)
                generateSingleIncidentReportPDF(
                    incident,
                    data?.title,
                    tirData?.documentRevisionHistory,
                )
            } else {
                console.log("Incident not found:", incidentNumber)
            }
        } catch (error) {
            console.error("Error generating single TIR PDF:", error)
        } finally {
            setTimeout(() => setIsExporting(false), 1000)
        }
    }

    const handleExportAll = () => {
        console.log("Exporting all documents")
        setIsExporting(true)
        try {
            const tirData = extractBlock(reportContent, "TIR");
            const telData = extractBlock(reportContent, "TEL");
            generateCombinedReportPDF(telData, tirData, data?.title)
        } catch (error) {
            console.error("Error generating combined PDF:", error)
        } finally {
            setTimeout(() => setIsExporting(false), 1000)
        }
    }

    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl">
            <div className='flex items-center justify-between mb-6'>
                <Link to={id ? `/projects/${id}` : '#'} viewTransition>
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al proyecto
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 glass min-w-[200px] bg-transparent">
                            <List className="w-4 h-4" />
                            <span className="text-sm">
                                {selectedHistoryId ? `Versión ${historyData?.find(v => v.history_id === selectedHistoryId)?.version || selectedHistoryId}` : 'Seleccionar versión'}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-auto" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[350px] glass">
                        <DropdownMenuLabel>Historial de Versiones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isHistoryLoading ? (
                            <DropdownMenuItem disabled>
                                <div className="text-sm text-muted-foreground">Cargando historial...</div>
                            </DropdownMenuItem>
                        ) : historyData && historyData.length > 0 ? (
                            historyData.map((version: ReportHistoryEntry) => (
                                <DropdownMenuItem
                                    key={version.history_id}
                                    className={`gap-2`}
                                    onClick={() => setSelectedHistoryId(version.history_id)}
                                >
                                    <FileText className="w-4 h-4" />
                                    <div className="flex-1 truncate">
                                        <div className="font-medium truncate">Versión {version.version}</div>
                                        <div className="text-xs text-muted-foreground mt-1 truncate">
                                            {new Date(version.created_at).toLocaleDateString("es-ES")} - {version.created_by}
                                        </div>
                                    </div>
                                    {version.history_id === selectedHistoryId && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>
                                <div className="text-sm text-muted-foreground">Sin historial disponible</div>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div
                style={{
                    viewTransitionName: `Report-view-${reportId}`
                }}
            >
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2 max-w-max"
                                style={{
                                    viewTransitionName: `Report-title-${reportId}`
                                }}
                            >
                                {data?.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Creado: {new Date(data?.created_at).toLocaleDateString("es-ES")}</span>
                                </div>
                                <Badge className={getStatusColor(data?.status)}>{data?.status}</Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {canEditReport && (
                                <Button className="gap-2 glow-hover" onClick={() => setEditOpen(true)}>
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-transparent" disabled={isExporting}>
                                        <Download className="w-4 h-4" />
                                        {isExporting ? "Exportando..." : "Exportar PDF"}
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 glass">
                                    <DropdownMenuLabel>Seleccionar documento</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleExportTEL} className="gap-2">
                                        <FileText className="w-4 h-4" />
                                        Test Execution Log
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-xs">Test Incident Reports ({incidents})</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={handleExportAllTIR} className="gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Todos los TIR ({failedTests})
                                    </DropdownMenuItem>
                                    {extractBlock(reportContent, "TIR")?.testIncidentReports?.map((incident: any) => (
                                        <DropdownMenuItem
                                            key={incident?.generalInformation?.incidentNumber}
                                            onClick={() => handleExportSingleTIR(incident?.generalInformation?.incidentNumber)}
                                            className="gap-2 pl-8 !text-xs"
                                        >
                                            {incident?.generalInformation?.incidentNumber} - {incident?.incidentDetails?.testCaseId}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleExportAll} className="gap-2 font-semibold">
                                        <Download className="w-4 h-4" />
                                        Exportar Todo
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>


                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="glass">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-3xl font-bold">{totalTests}</span>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tests Exitosos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-3xl font-bold text-green-400">{passedTests}</span>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Incidentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-3xl font-bold text-red-400">{incidents}</span>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Éxito</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span className="text-3xl font-bold">{successRate}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue='execution-log' className="space-y-6">
                    <TabsList className="glass">
                        <TabsTrigger value="execution-log" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Test Execution Log
                        </TabsTrigger>
                        <TabsTrigger value="incidents" className="gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Test Incident Reports ({incidents})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="execution-log">
                        <TestExecutionLogViewer
                            data={extractBlock(reportContent, "TEL")}
                            projectName={data.title}
                            totalTests={totalTests}
                            passedTests={passedTests}
                            failedTests={failedTests}
                            successRate={successRate}
                        />
                    </TabsContent>

                    <TabsContent value="incidents">
                        <TestIncidentReportViewer
                            data={extractBlock(reportContent, "TIR")}
                            projectName={data.title}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <ReportEditDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                report={data}
                refetch={refetch}
                selectedHistoryId={selectedHistoryId}
                projectId={id}
            />
        </div>
    );
};

export default ReportDefail;