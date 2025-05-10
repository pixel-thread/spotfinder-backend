import { ColumnDef } from '@tanstack/react-table';

type ParkingColumnT<T> = {
  columns: ColumnDef<T>[];
};
export function useParkingColumns<T>(): ParkingColumnT<T> {
  const columns: ColumnDef<T>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'price', header: 'Price' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'updatedAt', header: 'Updated At' },
  ];
  return { columns };
}
