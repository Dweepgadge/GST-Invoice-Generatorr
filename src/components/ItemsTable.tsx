import { Plus, Trash2 } from 'lucide-react';
import {
  GST_RATES,
  type GstRate,
  type LineItem,
  itemAmount,
  itemGst,
  itemTotal,
  formatINR,
} from '../types';

type Props = {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
};

export function ItemsTable({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<LineItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const add = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        gstRate: 18,
      },
    ]);
  };

  const remove = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="no-print-input">
      <div className="-mx-5 overflow-x-auto sm:mx-0">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <th className="rounded-l-lg px-3 py-2.5">#</th>
              <th className="px-3 py-2.5">Description</th>
              <th className="px-3 py-2.5 text-right">Qty</th>
              <th className="px-3 py-2.5 text-right">Unit Price</th>
              <th className="px-3 py-2.5 text-center">GST %</th>
              <th className="px-3 py-2.5 text-right">Amount</th>
              <th className="px-3 py-2.5 text-right">GST</th>
              <th className="px-3 py-2.5 text-right">Total</th>
              <th className="rounded-r-lg px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  No items yet. Click "Add row" to begin.
                </td>
              </tr>
            )}
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                <td className="px-3 py-2">
                  <input
                    value={item.description}
                    onChange={(e) =>
                      update(item.id, { description: e.target.value })
                    }
                    placeholder="Item or service description"
                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      update(item.id, { quantity: Number(e.target.value) || 0 })
                    }
                    className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-right text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) =>
                      update(item.id, { unitPrice: Number(e.target.value) || 0 })
                    }
                    className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-right text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={item.gstRate}
                    onChange={(e) =>
                      update(item.id, {
                        gstRate: Number(e.target.value) as GstRate,
                      })
                    }
                    className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    {GST_RATES.map((r) => (
                      <option key={r} value={r}>
                        {r}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right text-slate-700">
                  {formatINR(itemAmount(item))}
                </td>
                <td className="px-3 py-2 text-right text-slate-700">
                  {formatINR(itemGst(item))}
                </td>
                <td className="px-3 py-2 text-right font-medium text-slate-900">
                  {formatINR(itemTotal(item))}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
      >
        <Plus className="h-4 w-4" /> Add row
      </button>
    </div>
  );
}
