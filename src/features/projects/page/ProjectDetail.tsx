import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useProjectById } from '../services/projectService';
import { extraerConteoTotal, getStatusColor } from '@/lib/utils';
import ProyectDetailSkeleton from '../components/ProyectDetailSkeleton';
import StatsCards from '../components/StatsCards';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportsList from '@/features/reports/page/ReportsList';
import { useReportsByProjectId } from '@/features/reports/services/reportService';
import TeamList from '@/features/team/page/TeamList';
import { useTeamMembersByProjectId } from '@/features/team/services/teamService';
import { notifService } from '@/lib/notificationServiceInstance';
import ProjectEditDialog from './ProjectEdit';
import ProjectDeleteConfirmationDialog from '../components/ProjectDeleteConfirmationDialog';
import { useSelector } from 'react-redux';

const ProjectDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: project = {}, isLoading: isLoadingProject, error: projectError, refetch } = useProjectById(id);
    const { data: reports = [], isLoading: isLoadingReports, refetch: refetchReports } = useReportsByProjectId(id);
    const { data: teamMembers = [], isLoading: isLoadingTeamMembers, refetch: refetchTeamMembers } = useTeamMembersByProjectId(id);
    const { user: currentUser } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const unsubscribe = notifService.onReportCompleted(() => {
            refetchReports();
        });

        return () => {
            unsubscribe();
        };
    }, [refetchReports]);

    // Redirigir si hay error al cargar el proyecto (proyecto no encontrado)
    useEffect(() => {
        if (projectError && !isLoadingProject) {
            navigate('/', { replace: true });
        }
    }, [projectError, isLoadingProject, navigate]);

    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState<{
        open: boolean;
        projectId: string;
        projectTitle: string;
    }>({
        open: false,
        projectId: '',
        projectTitle: ''
    });

    const currentUserMember = teamMembers?.find((member: any) =>
        currentUser && String(currentUser.id) === String(member.user.user_id)
    );

    const userPermissions = currentUserMember?.permissions;
    // Solo los administradores pueden editar o eliminar el proyecto
    const canManageProject = userPermissions === 'admin';

    const handleDeleteClick = () => {
        setDeleteDialog({
            open: true,
            projectId: project.project_id,
            projectTitle: project.name
        });
    };

    const handleDeleteSuccess = () => {
        navigate('/', { replace: true });
    };

    if (isLoadingProject || isLoadingReports || isLoadingTeamMembers) return <ProyectDetailSkeleton />

    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl"

        >
            <Link to="/" viewTransition>
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a proyectos
                </Button>
            </Link>

            {/* Project Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 max-w-max"
                            style={{
                                viewTransitionName: `Project-title-${id}`
                            }}
                        >
                            {project.name}
                        </h1>
                        <p
                            style={{
                                viewTransitionName: `Project-description-${id}`
                            }}
                            className="text-muted-foreground max-w-max min-w-[600px]"
                        >
                            {project.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        {canManageProject && (
                            <>
                                <Button size="icon" aria-label="Editar proyecto" onClick={() => setEditOpen(true)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" aria-label="Eliminar proyecto" onClick={handleDeleteClick}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"
                        style={{
                            viewTransitionName: `Project-date-${id}`
                        }}
                    >
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(project.start_date).toLocaleDateString("es-ES")} -{" "}
                            {new Date(project.end_date).toLocaleDateString("es-ES")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards
                totalReports={reports.length}
                totalTests={extraerConteoTotal(reports)?.totalExecutions}
                totalFailedTests={extraerConteoTotal(reports)?.failed}
            />

            <Tabs defaultValue="reports" className="space-y-6">
                <TabsList className="glass">
                    <TabsTrigger value="reports">Reportes</TabsTrigger>
                    <TabsTrigger value="team">Equipo</TabsTrigger>

                </TabsList>
                <ReportsList project_id={id} data={reports} refetch={refetchReports} />
                <TeamList data={teamMembers} projectId={id!} refetch={refetchTeamMembers} />
            </Tabs>

            <ProjectEditDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                project={project}
                refetch={refetch}
            />

            <ProjectDeleteConfirmationDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
                projectId={deleteDialog.projectId}
                projectTitle={deleteDialog.projectTitle}
                onSuccess={handleDeleteSuccess}
            />
        </div >
    );
};

export default ProjectDetail;