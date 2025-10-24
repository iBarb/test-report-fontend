export interface ReportCreate {
    file: File | undefined;
    title?: string;
    prompt?: string;
}

export interface TestExecutionLog {
    documentRevisionHistory: Array<{
        date: string
        documentVersion: string
        revisionDescription: string
        author: string
    }>
    introduction: string
    testExecutionLog: Array<{
        status: "Passed" | "Failed" | "Blocked" | "Skipped"
        testCaseId: string
        dateTime: string
        logEntry: string
        impact: string
    }>
}

export interface TestIncidentReport {
    documentRevisionHistory: Array<{
        date: string
        documentVersion: string
        revisionDescription: string
        author: string
    }>
    testIncidentReports: Array<{
        generalInformation: {
            introduction: string,
            incidentNumber: string
            title: string
            product: string
            sprint: string
            status: string
            raisedBy: string
            dateTime: string
            details: string
        }
        incidentDetails: {
            shortTitle: string
            system: string
            systemVersion: string
            testCaseId: string
            testEnvironment: string
            createdBy: string
            dateTime_creation: string
            observedBy: string
            dateTime_observation: string
            details: string
            observedDuring: string
            severity: "Alto" | "Medio" | "Bajo"
            priority: string
            risk: string
        }
    }>
}

export interface ReportHistoryEntry {
    history_id: number;
    report_id: number;
    version: number | null;
    content: string | null;
    prompt: string | null;
    duration: number | null;
    created_at: Date;
    created_by: number;
}


export interface Report {
    report_id: string;
    title: string;
    status: string;
    prompt: string;
    created_at: string | Date;
    total_tests: number;
    failed_tests_count: number;
    duration: number;
    content: string;
}