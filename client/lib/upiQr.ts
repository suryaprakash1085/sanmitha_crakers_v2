// Builds a standard UPI payment deep-link and turns it into a scannable QR
// code image (as a base64 data URL) so invoices always show a QR that pays
// the exact invoice amount, instead of a static/manually uploaded QR image.

export function buildUpiUri(opts: {
  upiId: string;
  payeeName?: string;
  amount?: number;
  note?: string;
}): string {
  const params = new URLSearchParams();
  params.set("pa", opts.upiId); // payee address (UPI ID)
  if (opts.payeeName) params.set("pn", opts.payeeName);
  if (opts.amount !== undefined && !Number.isNaN(opts.amount)) {
    params.set("am", opts.amount.toFixed(2));
  }
  params.set("cu", "INR");
  if (opts.note) params.set("tn", opts.note);
  return `upi://pay?${params.toString()}`;
}

// Renders a QR code for arbitrary text via a public QR image service and
// returns it as a data URL, ready to embed straight into the jsPDF invoice
// with doc.addImage(). Throws if the network call fails — callers should
// catch and fall back to any previously configured static QR.
export async function fetchQrDataUrl(data: string, size = 300): Promise<string> {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("QR generation failed");
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
