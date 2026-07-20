/* eslint-disable no-unused-vars */
interface ReferenceListProps<Data extends { id: string }> {
  emptyLabel: string;
  items: Data[];
  getLabel: (item: Data) => string;
  selectedId?: string;
  onSelect: (item: Data) => void;
}

export function ReferenceList<Data extends { id: string }>({
  emptyLabel,
  items,
  getLabel,
  selectedId,
  onSelect,
}: ReferenceListProps<Data>) {
  if (items.length === 0) {
    return <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={
              "rounded-lg border px-3 py-2 text-left text-sm transition-colors " +
              (isSelected
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
            }
            onClick={() => onSelect(item)}
          >
            {getLabel(item)}
          </button>
        );
      })}
    </div>
  );
}
