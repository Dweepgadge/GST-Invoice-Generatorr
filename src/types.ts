export type BusinessDetails = {
  name: string;
  address: string;
  gstin: string;
  phone: string;
  email: string;
  logo: string | null;
};

export type ClientDetails = {
  name: string;
  address: string;
  gstin: string;
};

export type InvoiceMeta = {
  number: string;
  date: string;
  dueDate: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  gstRate: GstRate;
};

export type GstRate = 0 | 5 | 12 | 18 | 28;

export const GST_RATES: GstRate[] = [0, 5, 12, 18, 28];

export type InvoiceState = {
  business: BusinessDetails;
  client: ClientDetails;
  invoice: InvoiceMeta;
  items: LineItem[];
  paymentTerms: string;
  notes: string;
};

export function emptyItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    gstRate: 18,
  };
}

export function itemAmount(item: LineItem): number {
  return round2(item.quantity * item.unitPrice);
}

export function itemGst(item: LineItem): number {
  return round2((itemAmount(item) * item.gstRate) / 100);
}

export function itemTotal(item: LineItem): number {
  return round2(itemAmount(item) + itemGst(item));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type Totals = {
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  byRate: Record<number, { amount: number; gst: number }>;
};

export function computeTotals(items: LineItem[]): Totals {
  let subtotal = 0;
  let totalGst = 0;
  const byRate: Record<number, { amount: number; gst: number }> = {};
  for (const item of items) {
    const amt = itemAmount(item);
    const gst = itemGst(item);
    subtotal += amt;
    totalGst += gst;
    if (!byRate[item.gstRate]) byRate[item.gstRate] = { amount: 0, gst: 0 };
    byRate[item.gstRate].amount += amt;
    byRate[item.gstRate].gst += gst;
  }
  return {
    subtotal: round2(subtotal),
    totalGst: round2(totalGst),
    grandTotal: round2(subtotal + totalGst),
    byRate,
  };
}

export function formatINR(n: number): string {
  return n.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${y}${m}-${seq}`;
}
