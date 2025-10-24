import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Calendar, FileText } from 'lucide-react';
import React from 'react';

interface TestIncidentReportViewerProps {
    data: any;
    projectName: string;
}

const TestIncidentReportViewer: React.FC<TestIncidentReportViewerProps> = ({ data, projectName }) => {

    // Si no hay datos, no renderizar nada
    if (!data) return null;

    const getPriorityColor = (priority: string) => {
        const priorityNum = Number.parseInt(priority)
        if (!isNaN(priorityNum)) {
            if (priorityNum === 1) return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            if (priorityNum === 2) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        }
        return "bg-muted text-muted-foreground"
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Alto":
                return "bg-red-500/10 text-red-400 border-red-500/20"
            case "Medio":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            case "Bajo":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open":
                return "bg-red-500/10 text-red-400 border-red-500/20"
            case "Approved for Resolution":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            case "Fixed":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20"
            case "Retested and Confirmed":
                return "bg-green-500/10 text-green-400 border-green-500/20"
            case "Closed":
                return "bg-green-500/10 text-green-400 border-green-500/20"
            case "Rejected":
                return "bg-muted text-muted-foreground"
            case "Withdrawn":
                return "bg-muted text-muted-foreground"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in-0 duration-300">
            {/* Document Cover Page */}
            <Card className="glass border-red-500/20 bg-gradient-to-br from-background via-background to-red-500/5">
                <CardHeader className="space-y-6 relative">
                    <div className="text-center space-y-4 pt-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                TEST INCIDENT REPORT
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium">ISO/IEC/IEEE 29119-3</p>
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-muted-foreground">Project:</p>
                            <p className="text-xl font-semibold">
                                {projectName || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end absolute top-0 right-5">
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-sm px-4 py-1">VERSION 1.0</Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Document History */}
            <Card className="glass">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        DOCUMENT HISTORY
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Document Approval History */}
                    {/* <div className="space-y-4">
                        <h3 className="text-base font-bold uppercase tracking-wide">Document Approval History</h3>
                        <div className="flex gap-4 w-full">
                            <div className="bg-neutral-700/30 border border-border/50 rounded-lg p-4 w-full">
                                <Label className="text-xs text-muted-foreground uppercase">Prepared By</Label>
                                <p className="text-sm font-medium mt-1">{data.documentApprovalHistory?.preparedBy || "N/A"}</p>
                            </div>
                            <div className="bg-neutral-700/30 border border-border/50 rounded-lg p-4 w-full">
                                <Label className="text-xs text-muted-foreground uppercase">Reviewed By</Label>
                                <p className="text-sm font-medium mt-1">{data.documentApprovalHistory?.["Reviewed By"] || "N/A"}</p>
                            </div>
                            <div className="bg-neutral-700/30 border border-border/50 rounded-lg p-4 w-full">
                                <Label className="text-xs text-muted-foreground uppercase">Approved By</Label>
                                <p className="text-sm font-medium mt-1">{data.documentApprovalHistory?.["Approved By"] || "N/A"}</p>
                            </div>
                        </div>
                    </div> */}

                    {/* Document Revision History */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold uppercase tracking-wide">Document Revision History</h3>
                        <div className="border border-border/50 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-neutral-700/30 hover:bg-neutral-700/30">
                                        <TableHead className="font-bold">DATE</TableHead>
                                        <TableHead className="font-bold">DOCUMENT VERSION</TableHead>
                                        <TableHead className="font-bold">REVISION DESCRIPTION</TableHead>
                                        <TableHead className="font-bold">AUTHOR</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.documentRevisionHistory?.map((revision: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono text-sm">{revision.date}</TableCell>
                                            <TableCell className="font-mono text-sm">{revision.documentVersion}</TableCell>
                                            <TableCell className="text-sm">{revision.revisionDescription}</TableCell>
                                            <TableCell className="text-sm">{revision.author}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Incident Reports */}
            {data.testIncidentReports?.map((incident: any) => {

                return (
                    <Card key={incident.generalInformation.incidentNumber} className="glass !pt-0">
                        <CardHeader className="border-b border-border/50 relative pt-5">
                            <div className=' absolute w-full h-full border-border/50 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent' />
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">INCIDENT #{incident.generalInformation.incidentNumber}</CardTitle>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    <Badge className={getSeverityColor(incident.incidentDetails.severity)}>Severity: {incident.incidentDetails.severity}</Badge>
                                    <Badge className={getPriorityColor(incident.incidentDetails.priority)}>Priority: {incident.incidentDetails.priority}</Badge>
                                    <Badge className={getStatusColor(incident.generalInformation.status)}>{incident.generalInformation.status}</Badge>
                                </div>
                            </div>
                            <CardDescription className='pt-2'>
                                {incident.generalInformation?.introduction}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {/* ISO Standard Table Format */}
                            <div className='flex flex-col gap-7'>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        GENERAL INFORMATION
                                    </h3>
                                    <div className="glass rounded-lg border border-border/50 overflow-hidden">
                                        <table className="w-full text-sm bg-muted">
                                            <tbody>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Title</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.generalInformation.title}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Product</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.generalInformation.product}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Sprint #</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.generalInformation.sprint}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Status</td>
                                                    <td className="px-4 py-3 text-foreground/90">
                                                        <Badge className={getStatusColor(incident.generalInformation.status)}>{incident.generalInformation.status}</Badge>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Severity</td>
                                                    <td className="px-4 py-3 text-foreground/90 font-mono">
                                                        <Badge className={getSeverityColor(incident.incidentDetails.severity)}>{incident.incidentDetails.severity}</Badge>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Raised by</td>
                                                    <td className="px-4 py-3 text-foreground/90">
                                                        <div className="flex items-center justify-between">
                                                            <span>{incident.generalInformation.raisedBy}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {incident.generalInformation.dateTime}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground align-top">Details</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.generalInformation.details}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        INCIDENT DETAILS
                                    </h3>
                                    <div className="glass rounded-lg border border-border/50 overflow-hidden">
                                        <table className="w-full text-sm bg-muted">
                                            <tbody>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Short Title</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.shortTitle}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">System</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.system}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">System Version</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.systemVersion}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Test Enviroment</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.testEnvironment}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Test ID</td>
                                                    <td className="px-4 py-3 text-foreground/90 font-mono">{incident.incidentDetails.testCaseId}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Status</td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={getStatusColor(incident.generalInformation.status)}>{incident.generalInformation.status}</Badge>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Created by</td>
                                                    <td className="px-4 py-3 text-foreground/90">
                                                        <div className="flex items-center justify-between">
                                                            <span>{incident.incidentDetails.createdBy}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {incident.incidentDetails.dateTime_creation}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Observed by</td>
                                                    <td className="px-4 py-3 text-foreground/90">
                                                        <div className="flex items-center justify-between">
                                                            <span>{incident.incidentDetails.observedBy}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {incident.incidentDetails.dateTime_observation}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground align-top">Details</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.details}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground align-top">
                                                        Observed during
                                                    </td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.observedDuring}</td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Severity</td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={getSeverityColor(incident.incidentDetails.severity)}>{incident.incidentDetails.severity}</Badge>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground">Priority</td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={getPriorityColor(incident.incidentDetails.priority)}>{incident.incidentDetails.priority}</Badge>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-muted/20 transition-colors">
                                                    <td className="font-semibold bg-neutral-700/30 px-4 py-3 w-1/3 text-foreground align-top">Risk</td>
                                                    <td className="px-4 py-3 text-foreground/90">{incident.incidentDetails.risk}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
};

export default TestIncidentReportViewer;