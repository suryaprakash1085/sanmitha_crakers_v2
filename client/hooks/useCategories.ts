import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface CategorySummary {
  id: number;
  name: string;
  image: string | null;
  sortOrder: number;
}

function normalize(row: any): CategorySummary {
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? null,
    sortOrder: Number(row.sort_order) || 0,
  };
}

// Public categories list, ordered by the admin-configured display order
// (categories.sort_order). Used by the storefront to decide the order
// product sections appear in on the homepage.
export function useCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<{ data: any[] }>("/categories");
        const normalized = (res.data || []).map(normalize).sort((a, b) => a.sortOrder - b.sortOrder);
        if (!cancelled) setCategories(normalized);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
