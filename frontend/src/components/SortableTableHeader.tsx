interface SortableTableHeaderProps {
  label: string;
  field: string;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

const SortableTableHeader = ({ label, field, currentSortBy, currentSortOrder, onSort }: SortableTableHeaderProps) => {
  const isActive = currentSortBy === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && <span aria-hidden>{currentSortOrder === "asc" ? "▲" : "▼"}</span>}
      </span>
    </th>
  );
};

export default SortableTableHeader;