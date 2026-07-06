import {
  formatINR,
  itemAmount,
  itemGst,
  itemTotal,
  type InvoiceState,
  type Totals,
} from '../types';

type Props = {
  invoice: InvoiceState;
  totals: Totals;
};

export function PrintableInvoice({ invoice, totals }: Props) {
  const { business, client, items, notes, paymentTerms } = invoice;
  const invNumber = invoice.invoice.number || '—';

  return (
    <div id="printable-invoice" className="print-root hidden bg-white p-10 text-slate-900">
      <div className="mb-8 flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="flex items-start gap-4">
          {business.logo ? (
            <img
              src={business.logo}
              alt="logo"
              className="h-20 w-20 rounded-lg object-contain"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {business.name || 'Your Business'}
            </h1>
            {business.address && (
              <p className="mt-1 max-w-xs text-sm text-slate-600 whitespace-pre-line">
                {business.address}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {business.gstin && <span>GSTIN: {business.gstin}</span>}
            </p>
            <p className="text-xs text-slate-500">
              {business.phone && <span>{business.phone}</span>}
              {business.phone && business.email ? ' · ' : ''}
              {business.email && <span>{business.email}</span>}
            </p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-800">
            Invoice
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            No: {invNumber}
          </p>
          <p className="text-xs text-slate-500">
            Date: {invoice.invoice.date || '—'}
          </p>
          <p className="text-xs text-slate-500">
            Due: {invoice.invoice.dueDate || '—'}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Bill To
          </p>
          <p className="font-semibold text-slate-800">
            {client.name || 'Client name'}
          </p>
          {client.address && (
            <p className="text-sm text-slate-600 whitespace-pre-line">
              {client.address}
            </p>
          )}
          {client.gstin && (
            <p className="text-xs text-slate-500">GSTIN: {client.gstin}</p>
          )}
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Payment Terms
          </p>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {paymentTerms || 'Due on receipt'}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <th className="border border-slate-200 px-3 py-2">#</th>
            <th className="border border-slate-200 px-3 py-2">Description</th>
            <th className="border border-slate-200 px-3 py-2 text-right">Qty</th>
            <th className="border border-slate-200 px-3 py-2 text-right">
              Unit Price
            </th>
            <th className="border border-slate-200 px-3 py-2 text-center">
              GST %
            </th>
            <th className="border border-slate-200 px-3 py-2 text-right">
              Amount
            </th>
            <th className="border border-slate-200 px-3 py-2 text-right">GST</th>
            <th className="border border-slate-200 px-3 py-2 text-right">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="border border-slate-200 px-3 py-6 text-center text-slate-400">
                No items
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr key={item.id} className="even:bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 text-slate-500">
                  {idx + 1}
                </td>
                <td className="border border-slate-200 px-3 py-2">
                  {item.description || '—'}
                </td>
                <td className="border border-slate-200 px-3 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="border border-slate-200 px-3 py-2 text-right">
                  {formatINR(item.unitPrice)}
                </td>
                <td className="border border-slate-200 px-3 py-2 text-center">
                  {item.gstRate}%
                </td>
                <td className="border border-slate-200 px-3 py-2 text-right">
                  {formatINR(itemAmount(item))}
                </td>
                <td className="border border-slate-200 px-3 py-2 text-right">
                  {formatINR(itemGst(item))}
                </td>
                <td className="border border-slate-200 px-3 py-2 text-right font-medium">
                  {formatINR(itemTotal(item))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <table className="w-full max-w-xs text-sm">
          <tbody>
            <tr>
              <td className="px-2 py-1.5 text-slate-600">Subtotal</td>
              <td className="px-2 py-1.5 text-right font-medium">
                {formatINR(totals.subtotal)}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1.5 text-slate-600">Total GST</td>
              <td className="px-2 py-1.5 text-right font-medium">
                {formatINR(totals.totalGst)}
              </td>
            </tr>
            <tr className="border-t border-slate-300">
              <td className="px-2 py-2 text-base font-bold text-slate-900">
                Grand Total
              </td>
              <td className="px-2 py-2 text-right text-base font-bold text-slate-900">
                {formatINR(totals.grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {notes && (
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Notes / Bank Details
          </p>
          <p className="whitespace-pre-line text-sm text-slate-600">{notes}</p>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-slate-400">
        This is a computer-generated invoice and does not require a signature.
      </p>
    </div>
  );
}
