import React from 'react';
import { clsx } from 'clsx';
import { Badge, Button, LoadingSpinner } from './index';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectedRows?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  className?: string;
  rowKey?: keyof T | string;
  onRowClick?: (record: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  onSort,
  sortKey,
  sortDirection,
  pagination,
  className,
  rowKey = 'id',
  onRowClick,
}: TableProps<T>) {
  const hasSelection = onSelectRow || onSelectAll;
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
    }
    
    onSort(key, direction);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (onSelectRow) {
      const id = String(record[rowKey]);
      onSelectRow(id, checked);
    }
  };

  const handleRowClick = (record: T, e: React.MouseEvent) => {
    // Prevent row click when clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, [role="button"]')) {
      return;
    }
    
    if (onRowClick) {
      onRowClick(record);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={clsx('wedding-table-container', className)}>
      <div className="overflow-x-auto shadow-wedding rounded-wedding-lg">
        <table className="table-wedding">
          <thead>
            <tr>
              {hasSelection && (
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-navy-600 bg-warm-gray-100 border-warm-gray-300 rounded focus:ring-navy-500 focus:ring-2"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={String(column.key) + index}
                  style={{ width: column.width }}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-warm-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-navy-600 dark:hover:text-navy-400',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <svg className="w-3 h-3 text-navy-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-navy-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-warm-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-warm-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (hasSelection ? 1 : 0)} 
                  className="px-6 py-12 text-center text-warm-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="w-12 h-12 text-warm-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm">No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const id = String(record[rowKey]);
                const isSelected = selectedRows.includes(id);
                
                return (
                  <tr
                    key={id}
                    className={clsx(
                      'hover:bg-warm-gray-50 dark:hover:bg-gray-700 transition-colors',
                      isSelected && 'bg-navy-50 dark:bg-navy-900/20',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={(e) => handleRowClick(record, e)}
                  >
                    {hasSelection && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(record, e.target.checked)}
                          className="w-4 h-4 text-navy-600 bg-warm-gray-100 border-warm-gray-300 rounded focus:ring-navy-500 focus:ring-2"
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => {
                      const value = record[column.key as keyof T];
                      const content = column.render ? column.render(value, record, index) : String(value || '');
                      
                      return (
                        <td
                          key={String(column.key) + colIndex}
                          className={clsx(
                            'px-6 py-4 whitespace-nowrap text-sm text-warm-gray-900 dark:text-gray-100',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {content}
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
      
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-warm-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-warm-gray-700 dark:text-gray-300">
              Showing {((pagination.current - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline-primary"
              size="sm"
              disabled={pagination.current === 1}
              onClick={() => pagination.onChange(pagination.current - 1)}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) })
                .slice(
                  Math.max(0, pagination.current - 3),
                  Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.current + 2)
                )
                .map((_, index) => {
                  const page = Math.max(0, pagination.current - 3) + index + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.current ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => pagination.onChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
            </div>
            
            <Button
              variant="outline-primary"
              size="sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;