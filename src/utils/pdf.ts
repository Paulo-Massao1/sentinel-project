import type { TFunction } from "i18next";
import type { Case, Observation } from "../types";
import { formatDateTime } from "./date";

interface ExportPdfParams {
  caseData: Case;
  observations: Observation[];
  t: TFunction;
}

/** Generate and download a PDF report for a case with all its observations. */
export async function exportCasePdf({
  caseData,
  observations,
  t,
}: ExportPdfParams): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  function addHeader(): void {
    doc.setFillColor(26, 43, 74);
    doc.rect(0, 0, pageWidth, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SENTINEL", pageWidth / 2, 11, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(t("document.pdf.subtitle"), pageWidth / 2, 17, {
      align: "center",
    });
    doc.setDrawColor(100, 140, 200);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 30, 20, pageWidth / 2 + 30, 20);
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.text(
      t("document.pdf.generated", {
        date: new Date().toLocaleDateString(),
      }),
      pageWidth / 2,
      28,
      { align: "center" },
    );
  }

  function addFooter(): void {
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    const footerLines = doc.splitTextToSize(
      t("document.pdf.footer"),
      contentWidth,
    );
    doc.text(footerLines, pageWidth / 2, pageHeight - 12, {
      align: "center",
    });
  }

  function addInlineField(
    label: string,
    value: string,
    x: number,
    y: number,
    maxW: number,
    draw: boolean,
  ): number {
    if (!value) return y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const labelW = doc.getTextWidth(label + " ");
    if (draw) doc.text(label, x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value, maxW - labelW);
    if (lines.length === 1) {
      if (draw) doc.text(value, x + labelW, y);
      y += 5;
    } else {
      if (draw) doc.text(lines, x + labelW, y);
      y += 4.5 * lines.length;
    }
    return y;
  }

  function renderObservationBox(
    obs: Observation,
    index: number,
    startY: number,
    draw: boolean,
  ): number {
    if (!obs) return startY;
    const innerX = margin + 6;
    const innerW = contentWidth - 12;

    const obsLabel =
      t("document.pdf.observationLabel", { number: index + 1 }) +
      " — " +
      formatDateTime(obs.date);
    const concernLabel = t(
      `document.form.concernLevels.${obs.concernLevel}`,
    );
    const dotColors: Record<string, [number, number, number]> = {
      emergency: [239, 68, 68],
      high: [249, 115, 22],
      medium: [59, 130, 246],
      low: [156, 163, 175],
    };
    const dotColor = dotColors[obs.concernLevel] || [156, 163, 175];

    let y = startY + 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    if (draw) {
      doc.setTextColor(30, 30, 30);
      doc.text(obsLabel, innerX, y);
    }
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const clLabel = t("document.pdf.concernLevel") + ": ";
    const clLabelW = doc.getTextWidth(clLabel);
    if (draw) {
      doc.setTextColor(60, 60, 60);
      doc.text(clLabel, innerX, y);
      doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
      doc.circle(innerX + clLabelW + 2, y - 1.2, 1.5, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(dotColor[0], dotColor[1], dotColor[2]);
      doc.text(concernLabel, innerX + clLabelW + 6, y);
    }
    y += 4;

    if (obs.description) {
      y += 2;
      y = addInlineField(
        t("document.pdf.description") + ":",
        obs.description,
        innerX,
        y,
        innerW,
        draw,
      );
    }
    if (obs.signsChecked.length > 0) {
      const signsText = obs.signsChecked
        .map((s) => t(`identify.signs.${s.split("-").join("")}`))
        .join("; ");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      if (draw) {
        doc.setTextColor(60, 60, 60);
        doc.text(t("document.pdf.signs") + ":", innerX, y);
      }
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const signLines = doc.splitTextToSize(signsText, innerW);
      if (draw) {
        doc.setTextColor(30, 30, 30);
        doc.text(signLines, innerX, y);
      }
      y += 4 * signLines.length;
    }

    return y + 2;
  }

  // First page — case info
  addHeader();
  addFooter();
  let yPos = 34;

  const categoryLabel = t(
    `document.form.categoryOptions.${caseData.category}`,
  );
  const statusLabel = t(`document.cases.statuses.${caseData.status}`);

  yPos = addInlineField(t("document.pdf.caseName") + ":", caseData.name, margin, yPos, contentWidth, true);
  yPos = addInlineField(t("document.pdf.category") + ":", categoryLabel, margin, yPos, contentWidth, true);
  yPos = addInlineField(t("document.pdf.status") + ":", statusLabel, margin, yPos, contentWidth, true);
  yPos = addInlineField(t("document.pdf.created") + ":", new Date(caseData.createdAt).toLocaleDateString(), margin, yPos, contentWidth, true);

  const firstWithChildInfo = observations.find((o) => o.childInfo);
  if (firstWithChildInfo) {
    yPos = addInlineField(t("document.pdf.childInfo") + ":", firstWithChildInfo.childInfo, margin, yPos, contentWidth, true);
  }

  yPos += 4;

  // Observations (chronological)
  for (let i = 0; i < observations.length; i++) {
    const obs = observations[i]!;

    let measuredEndY = renderObservationBox(obs, i, yPos, false);
    let boxHeight = measuredEndY - yPos;

    if (yPos + boxHeight > pageHeight - 25) {
      doc.addPage();
      addHeader();
      addFooter();
      yPos = 40;
      measuredEndY = renderObservationBox(obs, i, yPos, false);
      boxHeight = measuredEndY - yPos;
    }

    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, "FD");
    const endY = renderObservationBox(obs, i, yPos, true);

    yPos = endY + 6;
  }

  doc.save(`sentinel-${caseData.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
