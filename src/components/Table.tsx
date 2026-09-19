import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-[10px] border border-[#E4E7EC] bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#FAFAFA]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#667085] ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2F4F7]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-[#667085]">
                Loading records...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-[#667085]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-[#F9FAFB]'
                      : 'hover:bg-[#FAFAFA]'
                  }`}
                >
                  {columns.map((col, cIdx) => {
                    let cellContent: React.ReactNode;
                    if (typeof col.accessor === 'function') {
                      cellContent = col.accessor(item);
                    } else if (col.accessor) {
                      cellContent = item[col.accessor] as unknown as React.ReactNode;
                    }

                    return (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-4 text-sm text-[#0B1220] ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
