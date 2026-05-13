import type { ReactNode } from "react";

interface Column {
  key: string;
  header: ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Record<string, ReactNode>[];
}

export function Table({ columns, data }: TableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[28px] border border-[var(--banana-stroke)] bg-white/80 shadow-[0_24px_60px_rgba(148,163,184,0.12)] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--banana-stroke)]">
            <thead className="bg-[var(--banana-mist)]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-4 text-left text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--banana-stroke)]">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-5 py-4 align-top text-sm text-slate-700"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="rounded-[24px] border border-[var(--banana-stroke)] bg-white/85 p-5 shadow-[0_20px_45px_rgba(148,163,184,0.14)]"
          >
            <div className="grid gap-3">
              {columns.map((col) => (
                <div key={col.key} className="grid gap-1">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    {col.header}
                  </span>
                  <div className="text-sm text-slate-700">{row[col.key]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
