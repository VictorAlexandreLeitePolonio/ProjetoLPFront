"use client";

export interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = "Nenhum item encontrado.",
  keyExtractor,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <p 
        className="text-[#4a6354] py-8 text-center"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Carregando...
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p 
        className="text-[#4a6354] py-8 text-center"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-[#e2ebe6] rounded-sm">
      <table className="w-full text-sm">
        <thead className="bg-[#f0f4f2]">
          <tr className="border-b-2 border-[#e2ebe6]">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`text-left py-3 px-4 font-semibold text-[#1a2a4a] uppercase text-xs tracking-wider ${col.className || ""}`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={keyExtractor(row)} 
              className="border-b border-[#e2ebe6] hover:bg-[#f8faf9] transition-colors"
            >
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  className={`py-3 px-4 text-[#1a2a4a] ${col.className || ""}`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {col.render ? col.render(row) : String((row as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
