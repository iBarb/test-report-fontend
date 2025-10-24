

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProjectSkeleton: React.FC = () => {
    return (
        <Card className="glass h-full">
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectSkeleton;
