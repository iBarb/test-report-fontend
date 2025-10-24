import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function ReportDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-7xl">
            {/* Back Button */}
            <div className="mb-6">
                <Skeleton className="h-10 w-48 rounded-md" />
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-1/3 rounded-md" />
                        <div className="flex items-center gap-4 mt-2">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-28 rounded-md" />
                        <Skeleton className="h-10 w-28 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="glass">
                        <CardHeader className="pb-3">
                            <Skeleton className="h-4 w-24 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-16 rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs value="execution-log" className="space-y-6">
                <TabsList className="glass">
                    <TabsTrigger value="execution-log">
                        <Skeleton className="h-4 w-36 rounded-md" />
                    </TabsTrigger>
                    <TabsTrigger value="incidents">
                        <Skeleton className="h-4 w-44 rounded-md" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="execution-log">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className={`${i === 0 ? "h-[344px]" : "h-52"} w-full rounded-md`}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="incidents">
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-md" />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}