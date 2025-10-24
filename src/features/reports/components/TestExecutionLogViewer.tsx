import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Clock, FileText, MinusCircle, XCircle } from 'lucide-react';
import React from 'react';

interface TestExecutionLogViewerProps {
    data: any;
    projectName: string;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    successRate: number;
}

const TestExecutionLogViewer: React.FC<TestExecutionLogViewerProps> = ({ data, projectName, totalTests, passedTests, failedTests, successRate }) => {
    // Si no hay datos, no renderizar nada
    if (!data) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Passed":
                return <CheckCircle2 className="w-4 h-4 text-green-400" />
            case "Failed":
                return <XCircle className="w-4 h-4 text-red-400" />
            case "Blocked":
                return <MinusCircle className="w-4 h-4 text-yellow-400" />
            case "Skipped":
                return <Clock className="w-4 h-4 text-muted-foreground" />
            default:
                return null
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in-0 duration-300">
            {/* Document Cover Page */}
            <Card className="glass border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
                <CardHeader className="space-y-6 relative">
                    <div className="text-center space-y-4 pt-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                                TEST EXECUTION LOG
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium">ISO/IEC/IEEE 29119-3</p>
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-muted-foreground">Project:</p>
                            <p className="text-xl font-semibold">{projectName}</p>
                        </div>
                    </div>
                    <div className="flex justify-end absolute top-0 right-5">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1">VERSION 1.0</Badge>
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
                        <div className="grid gap-4">
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                <Label className="text-xs text-muted-foreground uppercase">Prepared By</Label>
                                <p className="text-sm font-medium mt-1">{data.documentApprovalHistory?.preparedBy || "N/A"}</p>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                <Label className="text-xs text-muted-foreground uppercase">Reviewed By</Label>
                                <p className="text-sm font-medium mt-1">
                                    {data.documentApprovalHistory?.["Reviewed By"] || "N/A"}
                                </p>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                <Label className="text-xs text-muted-foreground uppercase">Approved By</Label>
                                <p className="text-sm font-medium mt-1">
                                    {data.documentApprovalHistory?.["Approved By"] || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div> */}

                    {/* Document Revision History */}
                    <div className="space-y-4">
                        {/* <h3 className="text-base font-bold uppercase tracking-wide">Document Revision History</h3> */}
                        <div className="border border-border/50 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
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

            {/* Introduction */}
            <Card className="glass">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">1. INTRODUCTION</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed text-foreground/90">{data.introduction || "No introduction available"}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Execution Summary */}
            <Card className="glass">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">2. EXECUTION SUMMARY</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground uppercase mb-2">Total Tests</p>
                            <span className="text-3xl font-bold">{totalTests}</span>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground uppercase mb-2">Passed</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span className="text-3xl font-bold text-green-400">{passedTests}</span>
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground uppercase mb-2">Failed</p>
                            <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-400" />
                                <span className="text-3xl font-bold text-red-400">{failedTests}</span>
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground uppercase mb-2">Success Rate</p>
                            <span className="text-3xl font-bold">{successRate}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Execution Details */}
            <Card className="glass">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">3. TEST EXECUTION DETAILS</CardTitle>
                    <CardDescription>Detailed results for each test case executed</CardDescription>
                </CardHeader>
                <CardContent className="pt-3">
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="font-bold w-[50px]">status</TableHead>
                                    <TableHead className="font-bold w-[50px]">Test Case ID</TableHead>
                                    <TableHead className="font-bold">Date/Time</TableHead>
                                    <TableHead className="font-bold">Log Entry</TableHead>
                                    <TableHead className="font-bold">Impact</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.testExecutionLog?.map((test: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex items-center justify-center">{getStatusIcon(test.status)}</div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{test.testCaseId}</TableCell>
                                        <TableCell className="font-mono text-sm">{test.dateTime}</TableCell>
                                        <TableCell className="font-mono max-w-md truncate">
                                            <span className="text-sm truncate">{test.logEntry}</span>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{test.impact}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestExecutionLogViewer;