import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

type RevisionEntry = {
    date: string;
    documentVersion: string;
    revisionDescription: string;
    author: string;
};

interface ReportHistoryProps {
    telHistory?: RevisionEntry[];
    tirHistory?: RevisionEntry[];
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const HistoryList: React.FC<{ title: string; entries?: RevisionEntry[] }> = ({ title, entries }) => {
    return (
        <Card className="glass">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {entries && entries.length > 0 ? (
                    <div className="space-y-3">
                        {entries.map((rev, idx) => (
                            <div key={`${rev.documentVersion}-${idx}`} className="flex items-start justify-between gap-4 p-3 rounded-md border border-border/50">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="shrink-0">v{rev.documentVersion}</Badge>
                                        <span className="text-xs text-muted-foreground">{formatDate(rev.date)}</span>
                                    </div>
                                    <p className="text-sm font-medium break-words">{rev.revisionDescription}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Autor: {rev.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Sin historial de revisiones.</p>
                )}
            </CardContent>
        </Card>
    );
};

const ReportHistory: React.FC<ReportHistoryProps> = ({ telHistory, tirHistory }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HistoryList title="TEL - Historial de revisiones" entries={telHistory} />
            <HistoryList title="TIR - Historial de revisiones" entries={tirHistory} />
        </div>
    );
};

export default ReportHistory;


