import type { TestExecutionLog, TestIncidentReport } from "@/features/reports/types/reporte"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Helper function to add page header
function addPageHeader(doc: jsPDF, title: string, projectName: string, pageNum: number) {
    console.log(projectName);

    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    // Top border line
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text("ISO/IEC/IEEE 29119-3:2021(E)", pageWidth - 20, 10, { align: "right" })

    // Footer with page number
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10, { align: "right" })
    doc.text(title, 15, pageHeight - 10)
}

export function generateTestExecutionLogPDF(data: TestExecutionLog, projectName: string) {
    const doc = new jsPDF()
    let yPosition = 20
    let pageNum = 1

    // Title Page
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, doc.internal.pageSize.width, 60, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("TEST EXECUTION LOG", doc.internal.pageSize.width / 2, 30, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("ISO/IEC/IEEE 29119-3", doc.internal.pageSize.width / 2, 42, { align: "center" })

    doc.setFontSize(10)
    doc.text(`Project: ${projectName}`, doc.internal.pageSize.width / 2, 52, { align: "center" })

    yPosition = 75
    doc.setTextColor(0, 0, 0)

    // Document History Section
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(59, 130, 246)
    doc.text("DOCUMENT HISTORY", 20, yPosition + 6)
    yPosition += 15

    autoTable(doc, {
        startY: yPosition,
        head: [["DATE", "VERSION", "REVISION DESCRIPTION", "AUTHOR"]],
        body: data.documentRevisionHistory.map((rev: any) => [
            rev.date,
            rev.documentVersion,
            rev.revisionDescription,
            rev.author,
        ]),
        theme: "striped",
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 10,
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // New page for content
    doc.addPage()
    pageNum++
    addPageHeader(doc, "Test Execution Log", projectName, pageNum)
    yPosition = 25

    // Introduction Section
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(59, 130, 246)
    doc.text("1. INTRODUCTION", 20, yPosition + 6)
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    const introLines = doc.splitTextToSize(data.introduction, 170)
    doc.text(introLines, 20, yPosition)
    yPosition += introLines.length * 5 + 15

    // Execution Summary Section
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(59, 130, 246)
    doc.text("2. EXECUTION SUMMARY", 20, yPosition + 6)
    yPosition += 15

    const totalTests = data.testExecutionLog.length
    const passedTests = data.testExecutionLog.filter((t) => t.status === "Passed").length
    const failedTests = data.testExecutionLog.filter((t) => t.status === "Failed").length
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : "0"

    // Summary boxes
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)

    // Total Tests Box
    doc.setFillColor(59, 130, 246)
    doc.roundedRect(20, yPosition, 40, 20, 2, 2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(totalTests.toString(), 40, yPosition + 10, { align: "center" })
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Total Tests", 40, yPosition + 16, { align: "center" })

    // Passed Tests Box
    doc.setFillColor(34, 197, 94)
    doc.roundedRect(65, yPosition, 40, 20, 2, 2, "F")
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(passedTests.toString(), 85, yPosition + 10, { align: "center" })
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Passed", 85, yPosition + 16, { align: "center" })

    // Failed Tests Box
    doc.setFillColor(239, 68, 68)
    doc.roundedRect(110, yPosition, 40, 20, 2, 2, "F")
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(failedTests.toString(), 130, yPosition + 10, { align: "center" })
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Failed", 130, yPosition + 16, { align: "center" })

    // Success Rate Box
    doc.setFillColor(168, 85, 247)
    doc.roundedRect(155, yPosition, 40, 20, 2, 2, "F")
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(`${successRate}%`, 175, yPosition + 10, { align: "center" })
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Success Rate", 175, yPosition + 16, { align: "center" })

    yPosition += 30

    // Test Execution Details
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(59, 130, 246)
    doc.text("3. TEST EXECUTION DETAILS", 20, yPosition + 6)
    yPosition += 12

    autoTable(doc, {
        startY: yPosition,
        head: [["ID", "Date/Time", "Status", "Log Entry", "Impact"]],
        body: data.testExecutionLog.map((test) => [
            test.testCaseId,
            test.dateTime,
            test.status || "N/A",
            test.logEntry,
            test.impact
        ]),
        theme: "striped",
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
        },
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        columnStyles: {
            0: { cellWidth: 25, fontStyle: "bold" },  // Test Case ID
            1: { cellWidth: 30 },                      // Date/Time
            2: { cellWidth: 20, halign: "center" },   // Status
            3: { cellWidth: 55 },                      // Log Entry
            4: { cellWidth: 50 },                      // Impact
        },
        didParseCell: (data) => {
            // Colorear la columna de Status
            if (data.column.index === 2 && data.cell.section === "body") {
                const status = data.cell.text[0]
                if (status === "Passed") {
                    data.cell.styles.textColor = [34, 197, 94]
                    data.cell.styles.fontStyle = "bold"
                } else if (status === "Failed") {
                    data.cell.styles.textColor = [239, 68, 68]
                    data.cell.styles.fontStyle = "bold"
                }
            }
        },
        didDrawPage: () => {
            pageNum++
            addPageHeader(doc, "Test Execution Log", projectName, pageNum)
        },
    })

    const filename = `Test_Execution_Log_${projectName.replace(/\s+/g, "_")}.pdf`
    doc.save(filename)
}

export function generateTestIncidentReportPDF(data: TestIncidentReport, projectName: string) {
    const doc = new jsPDF()
    let pageNum = 1

    data.testIncidentReports.forEach((incident, index) => {
        if (index > 0) {
            doc.addPage()
            pageNum++
        }

        let yPosition = 20

        // Title Page for each incident
        doc.setFillColor(239, 68, 68)
        doc.rect(0, 0, doc.internal.pageSize.width, 60, "F")

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("TEST INCIDENT REPORT", doc.internal.pageSize.width / 2, 25, { align: "center" })

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.text("ISO/IEC/IEEE 29119-3", doc.internal.pageSize.width / 2, 37, { align: "center" })

        doc.setFontSize(10)
        doc.text(`Project: ${projectName}`, doc.internal.pageSize.width / 2, 47, { align: "center" })
        doc.text(`Incident: ${incident.generalInformation.incidentNumber}`, doc.internal.pageSize.width / 2, 55, {
            align: "center",
        })

        yPosition = 75
        doc.setTextColor(0, 0, 0)

        // Document History
        doc.setFillColor(240, 240, 240)
        doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(239, 68, 68)
        doc.text("DOCUMENT HISTORY", 20, yPosition + 6)
        yPosition += 15

        autoTable(doc, {
            startY: yPosition,
            head: [["DATE", "VERSION", "REVISION DESCRIPTION", "AUTHOR"]],
            body: data.documentRevisionHistory.map((rev) => [
                rev.date,
                rev.documentVersion,
                rev.revisionDescription,
                rev.author,
            ]),
            theme: "striped",
            headStyles: {
                fillColor: [239, 68, 68],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 10,
            },
            styles: { fontSize: 9, cellPadding: 4 },
            alternateRowStyles: { fillColor: [254, 242, 242] },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // New page for content
        doc.addPage()
        pageNum++
        addPageHeader(doc, `Test Incident Report - ${incident.generalInformation.incidentNumber}`, projectName, pageNum)
        yPosition = 25

        // Introduction
        doc.setFillColor(240, 240, 240)
        doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(239, 68, 68)
        doc.text("1. INTRODUCTION", 20, yPosition + 6)
        yPosition += 15

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        if (incident.generalInformation.introduction) {
            const introLines = doc.splitTextToSize(incident.generalInformation.introduction, 170)
            doc.text(introLines, 20, yPosition)
            yPosition += introLines.length * 5 + 15
        }

        // General Information Section - TABLA ESTILO ISO
        doc.setFillColor(240, 240, 240)
        doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(239, 68, 68)
        doc.text("2. GENERAL INFORMATION", 20, yPosition + 6)
        yPosition += 13

        // Tabla con formato similar a "Incident # 31"
        autoTable(doc, {
            startY: yPosition,
            head: [["Incident # " + incident.generalInformation.incidentNumber, ""]],
            body: [
                ["Title", incident.generalInformation.title],
                ["Product", incident.generalInformation.product],
                ["Sprint #", incident.generalInformation.sprint || "N/A"],
                ["Status", incident.generalInformation.status || "N/A"],
                ["Severity", incident.incidentDetails.severity || "N/A"],
                ["Raised by", `${incident.generalInformation.raisedBy}`],
                ["Date / time", incident.generalInformation.dateTime],
                ["Details", incident.incidentDetails.details]
            ],
            theme: "grid",
            headStyles: {
                fillColor: [239, 68, 68],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 11,
                halign: "left",
            },
            bodyStyles: {
                fontSize: 10,
                textColor: [0, 0, 0],
            },
            columnStyles: {
                0: {
                    cellWidth: 50,
                    fontStyle: "bold",
                    fillColor: [254, 242, 242],
                },
                1: {
                    cellWidth: "auto",
                },
            },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10


        // Incident Details Section - TABLA ESTILO "DEFECT REPORT"
        if (yPosition > 240) {
            doc.addPage()
            pageNum++
            addPageHeader(doc, `Test Incident Report - ${incident.generalInformation.incidentNumber}`, projectName, pageNum)
            yPosition = 25
        }

        doc.setFillColor(240, 240, 240)
        doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(239, 68, 68)
        doc.text("3. INCIDENT DETAILS", 20, yPosition + 6)
        yPosition += 13

        // Defect Report Table - Estilo ISO pero con colores rojos
        autoTable(doc, {
            startY: yPosition,
            head: [["Defect Report", "", "", ""]],
            body: [
                ["Number", { content: incident.generalInformation.incidentNumber, colSpan: 3 }],
                ["Short Title", { content: incident.incidentDetails.shortTitle, colSpan: 3 }],
                ["System", { content: incident.incidentDetails.system, colSpan: 3 }],
                ["System Version", { content: incident.incidentDetails.systemVersion || "N/A", colSpan: 3 }],
                ["Test ID", { content: incident.incidentDetails.testCaseId || "N/A", colSpan: 3 }],
                ["Test Environment", { content: incident.incidentDetails.testEnvironment || "N/A", colSpan: 3 }],
                ["Status", { content: incident.generalInformation.status || "N/A", colSpan: 3 }],
                ["Created by", incident.incidentDetails.createdBy, "Date & time", incident.incidentDetails.dateTime_creation],
                ["Observed by", incident.incidentDetails.observedBy, "Date & time", incident.incidentDetails.dateTime_observation],
                ["Details", { content: incident.incidentDetails.details, colSpan: 3 }],
                ["Observed during", { content: incident.incidentDetails.observedDuring || "N/A", colSpan: 3 }],
                ["Severity", { content: incident.incidentDetails.severity || "N/A", colSpan: 3 }],
                ["Priority", { content: incident.incidentDetails.priority || "N/A", colSpan: 3 }],
                ["Risk", { content: incident.incidentDetails.risk || "N/A", colSpan: 3 }],
            ],
            theme: "grid",
            headStyles: {
                fillColor: [239, 68, 68],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 11,
                halign: "left",
            },
            bodyStyles: {
                fontSize: 10,
            },
            columnStyles: {
                0: {
                    cellWidth: 35,
                    fontStyle: "bold",
                    fillColor: [254, 242, 242],
                },
                1: {
                    cellWidth: "auto",
                },
                2: {
                    cellWidth: 25,
                    fontStyle: "bold",
                    fillColor: [254, 242, 242],
                },
                3: {
                    cellWidth: 40,
                },
            },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10

        // Status Badge (mantener el diseño original colorido)
        if (yPosition > 250) {
            doc.addPage()
            pageNum++
            addPageHeader(doc, `Test Incident Report - ${incident.generalInformation.incidentNumber}`, projectName, pageNum)
            yPosition = 25
        }

        doc.setFillColor(240, 240, 240)
        doc.rect(15, yPosition, doc.internal.pageSize.width - 30, 8, "F")
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(239, 68, 68)
        doc.text("INCIDENT STATUS", 20, yPosition + 6)

        yPosition += 12

        const statusColor: [number, number, number] =
            incident.generalInformation.status?.toLowerCase() === "cerrado" ||
                incident.generalInformation.status?.toLowerCase() === "closed"
                ? [34, 197, 94]
                : incident.generalInformation.status?.toLowerCase() === "abierto" ||
                    incident.generalInformation.status?.toLowerCase() === "open"
                    ? [239, 68, 68]
                    : [59, 130, 246]

        doc.setFillColor(...statusColor)
        doc.roundedRect(25, yPosition, 165, 12, 2, 2, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(incident.generalInformation.status || "N/A", 107.5, yPosition + 8, { align: "center" })
    })

    const filename = `Test_Incident_Report_${projectName.replace(/\s+/g, "_")}.pdf`
    doc.save(filename)
}


export function generateCombinedReportPDF(telData: TestExecutionLog, tirData: TestIncidentReport, projectName: string) {
    generateTestExecutionLogPDF(telData, projectName)
    setTimeout(() => {
        generateTestIncidentReportPDF(tirData, projectName)
    }, 500)
}

export function generateSingleIncidentReportPDF(
    incident: TestIncidentReport["testIncidentReports"][0],
    projectName: string,
    documentRevisionHistory: TestIncidentReport["documentRevisionHistory"],
) {
    const singleIncidentData: TestIncidentReport = {
        documentRevisionHistory,
        testIncidentReports: [incident],
    }

    generateTestIncidentReportPDF(singleIncidentData, projectName)
}
