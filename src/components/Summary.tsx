import { formatINR, type Totals } from '../types';

type Props = {
  totals: Totals;
};

export function Summary({ totals }: Props) {
  const rates = Object.keys(totals.byRate)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {rates.length > 0 && (
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            GST Breakdown
          </p>
          <div className="space-y-1.5">
            {rates.map((rate) => (
              <div
                key={rate}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600">GST @ {rate}%</span>
                <span className="font-medium text-slate-800">
                  {formatINR(totals.byRate[rate].gst)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-800">
            {formatINR(totals.subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total GST</span>
          <span className="font-medium text-slate-800">
            {formatINR(totals.totalGst)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-base font-bold text-slate-900">
            Grand Total
          </span>
          <span className="text-xl font-bold text-sky-700">
            {formatINR(totals.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
