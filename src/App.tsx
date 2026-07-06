import { useMemo, useRef, useState } from 'react';
import {
  Download,
  Trash,
  FileText,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { Field, Section } from './components/Field';
import { ItemsTable } from './components/ItemsTable';
import { Summary } from './components/Summary';
import { PrintableInvoice } from './components/PrintableInvoice';
import {
  computeTotals,
  emptyItem,
  generateInvoiceNumber,
  todayISO,
  type InvoiceState,
} from './types';

const defaultState = (): InvoiceState => ({
  business: {
    name: '',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    logo: null,
  },
  client: {
    name: '',
    address: '',
    gstin: '',
  },
  invoice: {
    number: generateInvoiceNumber(),
    date: todayISO(),
    dueDate: todayISO(),
  },
  items: [emptyItem()],
  paymentTerms: 'Due on receipt within 15 days.',
  notes:
    'Bank: State Bank of India\nAccount Name: \nAccount No: \nIFSC: SBIN0000000\nBranch: ',
});

export default function App() {
  const [state, setState] = useState<InvoiceState>(defaultState);
  const fileRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => computeTotals(state.items), [state.items]);

  const setBusiness = (patch: Partial<InvoiceState['business']>) =>
    setState((s) => ({ ...s, business: { ...s.business, ...patch } }));
  const setClient = (patch: Partial<InvoiceState['client']>) =>
    setState((s) => ({ ...s, client: { ...s.client, ...patch } }));
  const setInvoice = (patch: Partial<InvoiceState['invoice']>) =>
    setState((s) => ({ ...s, invoice: { ...s.invoice, ...patch } }));

  const handleLogo = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBusiness({ logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    if (
      !window.confirm('Clear the entire form? This cannot be undone.')
    )
      return;
    setState(defaultState());
  };

  const downloadPdf = () => {
    window.print();
  };

  const regenerateInvoiceNumber = () =>
    setInvoice({ number: generateInvoiceNumber() });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="no-print-input mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                GST Invoice Generator
              </h1>
              <p className="text-xs text-slate-500">
                Create, calculate and export GST-compliant invoices.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" /> Clear form
            </button>
          </div>
        </header>

        <div className="space-y-5">
          {/* Business + Client */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Section
              title="Business Details"
              description="Your company information shown on the invoice."
              actions={
                state.business.logo ? (
                  <button
                    type="button"
                    onClick={() => setBusiness({ logo: null })}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Remove logo
                  </button>
                ) : undefined
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    {state.business.logo ? (
                      <img
                        src={state.business.logo}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload logo
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                      onChange={(e) => handleLogo(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <Field
                  label="Business name"
                  value={state.business.name}
                  onChange={(v) => setBusiness({ name: v })}
                  placeholder="Acme Traders Pvt. Ltd."
                />
                <Field
                  label="Address"
                  value={state.business.address}
                  onChange={(v) => setBusiness({ address: v })}
                  placeholder="Street, City, State - PIN"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="GSTIN"
                    value={state.business.gstin}
                    onChange={(v) =>
                      setBusiness({ gstin: v.toUpperCase() })
                    }
                    placeholder="22AAAAA0000A1Z5"
                  />
                  <Field
                    label="Phone"
                    value={state.business.phone}
                    onChange={(v) => setBusiness({ phone: v })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <Field
                  label="Email"
                  type="email"
                  value={state.business.email}
                  onChange={(v) => setBusiness({ email: v })}
                  placeholder="billing@acme.com"
                />
              </div>
            </Section>

            <Section
              title="Client Details"
              description="Who the invoice is billed to."
            >
              <div className="space-y-4">
                <Field
                  label="Client name"
                  value={state.client.name}
                  onChange={(v) => setClient({ name: v })}
                  placeholder="Globex Corporation"
                />
                <Field
                  label="Address"
                  value={state.client.address}
                  onChange={(v) => setClient({ address: v })}
                  placeholder="Street, City, State - PIN"
                />
                <Field
                  label="GSTIN"
                  value={state.client.gstin}
                  onChange={(v) => setClient({ gstin: v.toUpperCase() })}
                  placeholder="27BBBBB1111B2Z6"
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Invoice no.
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        value={state.invoice.number}
                        onChange={(e) =>
                          setInvoice({ number: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                      <button
                        type="button"
                        onClick={regenerateInvoiceNumber}
                        title="Regenerate"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-500 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Field
                    label="Invoice date"
                    type="date"
                    value={state.invoice.date}
                    onChange={(v) => setInvoice({ date: v })}
                  />
                  <Field
                    label="Due date"
                    type="date"
                    value={state.invoice.dueDate}
                    onChange={(v) => setInvoice({ dueDate: v })}
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Items */}
          <Section
            title="Items"
            description="Add line items. Amounts and GST calculate automatically."
          >
            <ItemsTable
              items={state.items}
              onChange={(items) => setState((s) => ({ ...s, items }))}
            />
          </Section>

          {/* Summary + notes */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Section
              title="Summary"
              description="Auto-calculated from your items."
            >
              <Summary totals={totals} />
            </Section>
            <Section
              title="Terms & Notes"
              description="Payment terms and bank/account details."
            >
              <div className="space-y-4">
                <Field
                  label="Payment terms"
                  value={state.paymentTerms}
                  onChange={(v) => setState((s) => ({ ...s, paymentTerms: v }))}
                  placeholder="Due on receipt"
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Notes / Bank details
                  </span>
                  <textarea
                    value={state.notes}
                    onChange={(e) =>
                      setState((s) => ({ ...s, notes: e.target.value }))
                    }
                    rows={6}
                    placeholder="Bank, account no, IFSC, branch…"
                    className="no-print-input w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </div>
            </Section>
          </div>
        </div>

        <footer className="no-print-input mt-8 text-center text-xs text-slate-400">
          All calculations run locally in your browser. No data leaves your
          device.
        </footer>
      </div>

      {/* Hidden printable document */}
      <PrintableInvoice invoice={state} totals={totals} />
    </div>
  );
}
