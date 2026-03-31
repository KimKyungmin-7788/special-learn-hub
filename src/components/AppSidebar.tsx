import { ChevronDown } from "lucide-react";
import { useState } from "react";
import CategoryIcon from "./CategoryIcon";
import { categories } from "@/data/categories";
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
  const [basicOpen, setBasicOpen] = useState(true);
  const [electiveOpen, setElectiveOpen] = useState(true);

  const basicCats = categories.filter((c) => c.parent === "basic");
  const electiveCats = categories.filter((c) => c.parent === "elective");
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

        {/* 기본교육과정 */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer select-none flex items-center gap-1"
            onClick={() => setBasicOpen(!basicOpen)}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${basicOpen ? "" : "-rotate-90"}`} />
            기본교육과정
          </SidebarGroupLabel>
          {basicOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                {basicCats.map((cat) => (
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

        {/* 선택중심교육과정 */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="cursor-pointer select-none flex items-center gap-1"
            onClick={() => setElectiveOpen(!electiveOpen)}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${electiveOpen ? "" : "-rotate-90"}`} />
            선택중심교육과정
          </SidebarGroupLabel>
          {electiveOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                {electiveCats.map((cat) => (
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
