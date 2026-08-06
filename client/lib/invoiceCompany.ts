import { api } from "./api";
import { settingsStore, type PdfSettings } from "./appSettings";
import { buildUpiUri, fetchQrDataUrl } from "./upiQr";

export interface CompanyApiData {
  company_name?: string;
  gst_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  bank_name?: string;
  account_holder_name?: string;
  account_number?: string;
  account_type?: string;
  ifsc_code?: string;
  upi_id?: string;
}

// Builds the PdfSettings config passed to buildInvoicePdf. Company name,
// GSTIN, address, phone, and bank/UPI details are pulled fresh from
// GET /api/company (the Company Details admin page) rather than the copies
// saved separately in PDF Template settings, so invoices always reflect the
// latest business details. The "Scan to Pay" QR is generated live from the
// company's UPI ID + this invoice's total amount.
export async function buildLiveInvoiceCfg(total: number): Promise<PdfSettings> {
  const pdfCfg = settingsStore.getPdf();

  let company: CompanyApiData | null = null;
  try {
    const res = await api.get<{ data: CompanyApiData }>("/company");
    company = res.data || null;
  } catch {
    company = null;
  }

  const cfg: PdfSettings = {
    ...pdfCfg,
    companyName: company?.company_name || pdfCfg.companyName,
    companyPhone: company?.phone || pdfCfg.companyPhone,
    companyEmail: company?.email || pdfCfg.companyEmail,
    companyAddress: company?.address || pdfCfg.companyAddress,
    gstin: company?.gst_number || pdfCfg.gstin,
    bankName: company?.bank_name || pdfCfg.bankName,
    bankAccName: company?.account_holder_name || pdfCfg.bankAccName,
    bankAccNo: company?.account_number || pdfCfg.bankAccNo,
    bankAccType: company?.account_type || pdfCfg.bankAccType,
    bankIfsc: company?.ifsc_code || pdfCfg.bankIfsc,
    bankUpi: company?.upi_id || pdfCfg.bankUpi,
  };

  if (cfg.showQr && cfg.bankUpi) {
    try {
      const upiUri = buildUpiUri({
        upiId: cfg.bankUpi,
        payeeName: cfg.companyName,
        amount: total,
        note: cfg.headerTitle,
      });
      cfg.qrDataUrl = await fetchQrDataUrl(upiUri);
    } catch {
      // Network/QR-service failure: keep whatever qrDataUrl was already
      // configured (e.g. a manually uploaded static QR) as a fallback.
    }
  }

  return cfg;
}
