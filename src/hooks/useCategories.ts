import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  parent?: string | null;
  sortOrder: number;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        bgColor: c.bg_color,
        parent: c.parent,
        sortOrder: c.sort_order,
      })) as Category[];
    },
  });
}
