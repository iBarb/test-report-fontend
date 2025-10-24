import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router";

export default function ProyectDetailSkeleton() {
    const { id } = useParams();
    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl animate-in fade-in-50"
        >
            {/* Volver */}
            <div className="mb-6">
                <Button variant="ghost" disabled className="gap-2 opacity-50">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </Button>
            </div>

            {/* Header */}
            <div className="mb-8 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64"
                            style={{
                                viewTransitionName: `Project-title-${id}`
                            }}
                        />
                        <Skeleton className="h-4 w-[600px]"
                            style={{
                                viewTransitionName: `Project-description-${id}`
                            }}
                        />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-6">
                    <Skeleton className="h-4 w-56"
                        style={{
                            viewTransitionName: `Project-date-${id}`
                        }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="glass">
                        <CardHeader className="pb-3">
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5 rounded-full" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reports" className="space-y-6">
                <TabsList className="glass">
                    <TabsTrigger value="reports" disabled>Reportes</TabsTrigger>
                    <TabsTrigger value="team" disabled>Equipo</TabsTrigger>
                </TabsList>

                {/* Reports Skeleton */}
                <TabsContent value="reports" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-9 w-36 rounded-md" />
                    </div>

                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="glass">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-56" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Team Skeleton */}
                <TabsContent value="team" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-9 w-36 rounded-md" />
                    </div>

                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="glass">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-48" />
                                                <Skeleton className="h-4 w-40" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}