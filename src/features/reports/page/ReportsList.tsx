import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useTeamMembersByProjectId } from '@/features/team/services/teamService';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReportCreate from './ReportCreate';
import ReportCard from '../components/ReportCard';

interface Reports {
    report_id: string | number;
    title: string;
    status: string;
    created_at: string | Date;
    total_tests: number;
    failed_tests_count: number;
    duration: number;
    content: string;
}


interface ReportsListProps {
    data: Reports[];
    project_id: string | undefined;
    refetch: () => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ data, project_id, refetch }) => {
    const [showCreateReportDialog, setShowCreateReportDialog] = useState(false);
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const { data: teamMembers } = useTeamMembersByProjectId(project_id);

    const currentUserMember = teamMembers?.find((member: any) =>
        currentUser && String(currentUser.id) === String(member.user.user_id)
    );

    const userPermissions = currentUserMember?.permissions;
    const canCreateReport = userPermissions === 'admin' || userPermissions === 'editor';

    return (
        <>
            <TabsContent value="reports" className="space-y-4 animate-in fade-in-0 duration-300">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Reportes de Ejecución</h2>
                    {canCreateReport && (
                        <Button className="gap-2 glow-hover" onClick={() => setShowCreateReportDialog(true)}>
                            <Plus className="w-4 h-4" />
                            Nuevo Reporte
                        </Button>
                    )}
                </div>

                {/* Reports List */}
                <div className="flex flex-col gap-4">
                    {data.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground italic">No se encontraron reportes...</p>
                        </div>
                    )}

                    {data.length !== 0 && data.map((report: Reports) => (
                        <ReportCard
                            key={report.report_id}
                            report={report}
                            projectId={project_id || ''}
                            onRefetch={refetch}
                        />
                    ))}
                </div>
            </TabsContent>

            <ReportCreate
                open={showCreateReportDialog}
                onOpenChange={setShowCreateReportDialog}
                projectId={project_id}
                refetch={refetch}
            />
        </>
    );
};

export default ReportsList;