import type { ReactNode } from "react";

interface Column {
  key: string;
  header: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, ReactNode>[];
}

export function Table({ columns, data }: TableProps) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
