import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useProjects } from '../services/projectService';
import { getStatusColor } from '@/lib/utils';
import ProjectCard from '../components/ProjectCard';
import ProjectSkeleton from '../components/ProjectSkeleton';
import ProjectCreateDialog from './ProjectCreate';

const ProjectList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const { data = [], isLoading, isFetching, refetch } = useProjects();

    const showSkeleton = isLoading || isFetching;

    const filteredProjects = data.filter(
        (project: any) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl">

            {/* Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Proyectos de Investigación</h1>
                        <p className="text-muted-foreground">
                            Gestiona tus proyectos de pruebas automatizadas y reportes de incidentes
                        </p>
                    </div>
                    <Button size="lg" className="gap-2 glow-hover" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-5 h-5" />
                        Nuevo Proyecto
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-[1]" />
                    <Input
                        placeholder="Buscar proyectos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glass"
                    />
                </div>
            </div>

            {/* Projects List */}

            {!showSkeleton && filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground italic">No se encontraron proyectos...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showSkeleton && (Array.from({ length: 6 }).map((_, i) => (
                    <ProjectSkeleton key={i} />
                )))}

                {!showSkeleton && filteredProjects.map((project: any) => (
                    <ProjectCard
                        key={project.project_id}
                        project={project}
                        getStatusColor={getStatusColor}
                    />
                ))}
            </div>
            <ProjectCreateDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} refetch={refetch} />
        </div>
    );
};

export default ProjectList;