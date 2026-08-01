import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  current: string;
  onChange: (v: string) => void;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder?: string;
  filters?: FilterOption[];
  right?: React.ReactNode;
}

export const TableFilters = ({ search, onSearchChange, placeholder = "Search...", filters = [], right }: Props) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-3 flex flex-col md:flex-row md:items-center gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500/70" />
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 bg-slate-50 border-slate-200"
      />
    </div>
    {filters.length > 0 && (
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden md:block" />
        {filters.map((f) => (
          <Select key={f.label} value={f.current} onValueChange={f.onChange}>
            <SelectTrigger className="w-full md:w-[170px]">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All {f.label}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    )}
    {right}
  </div>
);
