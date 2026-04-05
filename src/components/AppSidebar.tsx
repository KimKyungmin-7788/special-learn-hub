import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryIcon from "./CategoryIcon";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function AppSidebar({ selectedCategory, onSelectCategory }: AppSidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { data: categories = [] } = useCategories();

  const { data: groups = [] } = useQuery({
    queryKey: ["category-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("category_groups").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const toggleGroup = (id: string) => setOpenGroups((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  const isOpen = (id: string) => openGroups[id] ?? true;

  const standaloneCats = categories.filter((c) => !c.parent);

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        {/* All */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onSelectCategory(null)}
              className={`mx-2 ${!selectedCategory ? "bg-accent font-semibold" : ""}`}
            >
              전체 보기
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Dynamic groups */}
        {groups.map((group) => {
          const groupCats = categories.filter((c) => c.parent === group.id);
          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel
                className="cursor-pointer select-none flex items-center gap-1"
                onClick={() => toggleGroup(group.id)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen(group.id) ? "" : "-rotate-90"}`} />
                {group.name}
              </SidebarGroupLabel>
              {isOpen(group.id) && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {groupCats.map((cat) => (
                      <SidebarMenuItem key={cat.id}>
                        <SidebarMenuButton
                          onClick={() => onSelectCategory(cat.id)}
                          className={`mx-2 flex items-center gap-2 ${selectedCategory === cat.id ? "bg-accent font-semibold" : ""}`}
                        >
                          <CategoryIcon categoryId={cat.id} size={24} />
                          <span>{cat.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}

        {/* Standalone */}
        <SidebarMenu>
          {standaloneCats.map((cat) => (
            <SidebarMenuItem key={cat.id}>
              <SidebarMenuButton
                onClick={() => onSelectCategory(cat.id)}
                className={`mx-2 flex items-center gap-2 ${selectedCategory === cat.id ? "bg-accent font-semibold" : ""}`}
              >
                <CategoryIcon categoryId={cat.id} size={24} />
                <span>{cat.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
