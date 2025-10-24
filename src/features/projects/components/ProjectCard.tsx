import { Link } from 'react-router';
import { Calendar, FileText, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

interface Project {
    project_id: string | number;
    name: string;
    status: string;
    description: string;
    start_date: string | Date;
    end_date: string | Date;
    reports_count: number;
    members_count: number;
}

interface ProjectCardProps {
    project: Project;
    getStatusColor: (status: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, getStatusColor }) => {

    return (
        <Link to={`/projects/${project.project_id}`} viewTransition>
            <Card
                className="glass flex flex-col justify-between hover:scale-102 transition-all duration-300 cursor-pointer h-full group"
            >
                <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl transition-colors"
                            style={{
                                viewTransitionName: `Project-title-${project.project_id}`
                            }}
                        >
                            {project.name}
                        </CardTitle>
                        <Badge className={getStatusColor(project.status)}>
                            {project.status}
                        </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 w-full"
                        style={{
                            viewTransitionName: `Project-description-${project.project_id}`
                        }}
                    >
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-max"
                            style={{
                                viewTransitionName: `Project-date-${project.project_id}`
                            }}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(project.start_date).toLocaleDateString("es-ES")} -{" "}
                                {new Date(project.end_date).toLocaleDateString("es-ES")}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="font-medium">{project.reports_count}</span>
                                <span className="text-muted-foreground">reportes</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-accent" />
                                <span className="font-medium">{project.members_count}</span>
                                <span className="text-muted-foreground">miembros</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link >
    );
};

export default ProjectCard;