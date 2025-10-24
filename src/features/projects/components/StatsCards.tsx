import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface StatsCardsProps {
    totalReports: number;
    totalTests: number;
    totalFailedTests: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalReports, totalTests, totalFailedTests }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground z-10">Total Reportes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-3xl font-bold">{totalReports}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tests Ejecutados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-3xl font-bold">{totalTests}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tests Fallidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-3xl font-bold">{totalFailedTests}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsCards;