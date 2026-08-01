import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PdfSettings, hexToRgb } from "./appSettings";

export type InvoiceItem = {
  name: string;
  qty: number;
  price: number;
  unit?: string;
  discountPct?: number;
};

export type InvoiceData = {
  invoiceNo: string;
  date: string;
  receiptNo?: string;
  customer: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  items: InvoiceItem[];
  total: number;
  tax?: number;
  dropLocation?: string;
};

const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Rupees Only";
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n/10)] + (n%10 ? " " + a[n%10] : "");
    if (n < 1000) return a[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + inWords(n%100) : "");
    if (n < 100000) return inWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + inWords(n%1000) : "");
    if (n < 10000000) return inWords(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + inWords(n%100000) : "");
    return inWords(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + inWords(n%10000000) : "");
  };
  return inWords(Math.floor(num)).replace(/\s+/g, " ").trim() + " Rupees Only";
};

/** Renders a Tax-Invoice styled PDF and returns the jsPDF doc (caller decides save vs blob). */
export const buildInvoicePdf = (cfg: PdfSettings, data: InvoiceData): jsPDF => {
  const [r, g, b] = hexToRgb(cfg.accentHex);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 10;
  const fs = cfg.baseFontSize;

  // Top ribbon (thin accent)
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, W, 2, "F");

  // Title row
  doc.setTextColor(30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs - 1);
  doc.text(`GSTIN: ${cfg.gstin || "-"}`, M, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs + 6);
  doc.text(cfg.headerTitle, W / 2, 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs - 1);
  doc.text(cfg.copyLabel, W - M, 10, { align: "right" });

  // Company + Bill To + Drop Location boxes
  let y = 14;
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.rect(M, y, W - 2 * M, 32);
  doc.line(M + 70, y, M + 70, y + 32);
  doc.line(M + 135, y, M + 135, y + 32);

  // Company block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs + 1);
  doc.setTextColor(r, g, b);
  doc.text(cfg.companyName, M + 2, y + 6);
  doc.setTextColor(60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs - 2);
  const addr = doc.splitTextToSize(cfg.companyAddress, 66);
  doc.text(addr, M + 2, y + 11);
  doc.text(cfg.companyPhone, M + 2, y + 26);

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs - 1);
  doc.setTextColor(90);
  doc.text("Bill To:", M + 72, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs);
  doc.setTextColor(20);
  doc.text(data.customer.name || "-", M + 72, y + 11);
  doc.setFontSize(fs - 2);
  doc.setTextColor(70);
  const custLines: string[] = [];
  if (data.customer.phone) custLines.push(data.customer.phone);
  const loc = [data.customer.city, data.customer.state, data.customer.pincode].filter(Boolean).join(", ");
  if (loc) custLines.push(loc);
  if (data.customer.address) custLines.push(...doc.splitTextToSize(data.customer.address, 60));
  doc.text(custLines.slice(0, 5), M + 72, y + 16);

  // Drop Location
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs - 1);
  doc.setTextColor(90);
  doc.text("Drop location:", M + 137, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs - 2);
  doc.setTextColor(70);
  if (data.dropLocation) {
    doc.text(doc.splitTextToSize(data.dropLocation, 60), M + 137, y + 11);
  }

  // Meta strip
  y += 32;
  doc.setFillColor(245, 245, 245);
  doc.rect(M, y, W - 2 * M, 8, "F");
  doc.setTextColor(90);
  doc.setFontSize(fs - 2);
  doc.setFont("helvetica", "bold");
  doc.text("Order No", M + 2, y + 5);
  doc.text("Receipt No", M + 40, y + 5);
  doc.text("Place Of Supply", M + 80, y + 5);
  doc.text("Date", W - M - 30, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(20);
  doc.text(data.invoiceNo, M + 2, y + 12);
  doc.text(String(data.receiptNo || "-"), M + 40, y + 12);
  doc.text(cfg.placeOfSupply || "-", M + 80, y + 12);
  doc.text(data.date, W - M - 30, y + 12);

  // Items table
  autoTable(doc, {
    startY: y + 15,
    head: [["S.N", "Items", "Qty", "Unit", "Price", "Total", "Disc", "Amount"]],
    body: data.items.map((it, i) => {
      const gross = it.price * it.qty;
      const discAmt = it.discountPct ? (gross * it.discountPct) / 100 : 0;
      const net = gross - discAmt;
      return [
        i + 1,
        it.name,
        it.qty,
        it.unit || "-",
        `Rs.${it.price}`,
        `Rs.${gross}`,
        it.discountPct ? `${it.discountPct}% (Rs.${discAmt.toFixed(0)})` : "-",
        `Rs.${net.toFixed(0)}`,
      ];
    }),
    headStyles: { fillColor: [r, g, b], textColor: 255, fontSize: fs - 1 },
    styles: { fontSize: fs - 1, cellPadding: 1.6 },
    theme: "grid",
    margin: { left: M, right: M },
  });

  let fy = (doc as any).lastAutoTable.finalY + 3;
  const totalQty = data.items.reduce((s, i) => s + i.qty, 0);

  // Total qty strip
  doc.setFillColor(245, 245, 245);
  doc.rect(M, fy, W - 2 * M, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs - 1);
  doc.setTextColor(30);
  doc.text(`Total Qty: ${totalQty}`, M + 2, fy + 5);
  doc.text("Subtotal", W - M - 30, fy + 5);
  doc.text(`Rs. ${data.total}`, W - M - 2, fy + 5, { align: "right" });
  fy += 7;

  // Words + totals
  doc.setFont("helvetica", "italic");
  doc.setTextColor(70);
  doc.setFontSize(fs - 2);
  doc.text(numberToWords(data.total), M + 2, fy + 5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30);
  doc.text("Total Tax", W - M - 30, fy + 5);
  doc.text(`Rs. ${data.tax || 0}`, W - M - 2, fy + 5, { align: "right" });
  fy += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Total", W - M - 30, fy + 5);
  doc.text(`Rs. ${data.total}`, W - M - 2, fy + 5, { align: "right" });
  fy += 8;

  // Grand total pill
  doc.setFillColor(r, g, b);
  doc.rect(M, fy, W - 2 * M, 9, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs + 2);
  doc.text("Total Amount", M + 3, fy + 6);
  doc.text(`Rs. ${data.total}`, W - M - 3, fy + 6, { align: "right" });
  fy += 14;

  // Bank + QR + Authorized
  if (cfg.showBankDetails || cfg.showQr) {
    const boxH = 42;
    doc.setDrawColor(200);
    doc.rect(M, fy, W - 2 * M, boxH);
    doc.line(M + 75, fy, M + 75, fy + boxH);
    doc.line(M + 130, fy, M + 130, fy + boxH);

    if (cfg.showBankDetails) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fs - 1);
      doc.setTextColor(r, g, b);
      doc.text("Bank Details", M + 2, fy + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fs - 2);
      doc.setTextColor(50);
      const rows = [
        ["Acc Holder:", cfg.bankAccName],
        ["Acc No:", cfg.bankAccNo],
        ["Acc Type:", cfg.bankAccType],
        ["Bank:", cfg.bankName],
        ["IFSC:", cfg.bankIfsc],
        ["UPI:", cfg.bankUpi],
      ];
      rows.forEach((rw, i) => {
        doc.setTextColor(120);
        doc.text(rw[0], M + 2, fy + 11 + i * 5);
        doc.setTextColor(20);
        doc.text(rw[1] || "-", M + 22, fy + 11 + i * 5);
      });
    }

    // QR center
    if (cfg.showQr) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fs - 2);
      doc.setTextColor(90);
      doc.text("Scan to Pay", M + 77 + 27, fy + 5, { align: "center" });
      if (cfg.qrDataUrl) {
        try {
          doc.addImage(cfg.qrDataUrl, "PNG", M + 88, fy + 7, 30, 30);
        } catch { /* ignore */ }
      } else {
        doc.setDrawColor(180);
        doc.rect(M + 88, fy + 7, 30, 30);
        doc.setFontSize(fs - 3);
        doc.setTextColor(140);
        doc.text("QR", M + 103, fy + 24, { align: "center" });
      }
      doc.setFontSize(fs - 3);
      doc.setTextColor(120);
      doc.text("(Any UPI App)", M + 103, fy + 40, { align: "center" });
    }

    // Authorized
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fs - 2);
    doc.setTextColor(50);
    doc.text(cfg.authorizedFor, M + 132, fy + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140);
    doc.text("Authorized Signatory", M + 132, fy + boxH - 3);
    fy += boxH + 4;
  }

  // Terms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs - 1);
  doc.setTextColor(r, g, b);
  doc.text("Terms & Conditions", M, fy);
  fy += 2;
  doc.setDrawColor(220);
  doc.line(M, fy, W - M, fy);
  fy += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fs - 2);
  doc.setTextColor(70);
  const termLines = doc.splitTextToSize(cfg.terms, W - 2 * M);
  doc.text(termLines, M, fy);
  fy += termLines.length * 4 + 3;

  // Thank you banner
  if (cfg.showThankYou) {
    doc.setFillColor(255, 248, 220);
    doc.setDrawColor(240, 200, 80);
    doc.rect(M, fy, W - 2 * M, 12, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fs);
    doc.setTextColor(120, 80, 0);
    doc.text(cfg.thankYouNote, W / 2, fy + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fs - 2);
    doc.text(`For queries, contact: ${cfg.supportContact}`, W / 2, fy + 10, { align: "center" });
    fy += 14;
  }

  // Footer note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(fs - 3);
  doc.setTextColor(140);
  doc.text(cfg.footerNote, M, 290);
  doc.text("Page 1", W - M, 290, { align: "right" });

  return doc;
};
