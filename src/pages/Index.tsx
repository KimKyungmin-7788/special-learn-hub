import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import HomeBanner from "@/components/HomeBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ToolCard from "@/components/ToolCard";
import { supabase } from "@/integrations/supabase/client";
import { sampleTools, type Tool } from "@/data/categories";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dbTools } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const allTools: Tool[] = useMemo(() => {
    if (dbTools && dbTools.length > 0) {
      return dbTools.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        categoryId: t.category_id,
        targetLevel: t.targets,
        url: t.url,
        thumbnail: t.thumbnail_url ?? undefined,
      }));
    }
    return sampleTools;
  }, [dbTools]);

  const filteredTools = useMemo(() => {
    let tools = allTools;
    if (selectedCategory) {
      tools = tools.filter((t) => t.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      tools = tools.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return tools;
  }, [allTools, selectedCategory, searchQuery]);

  const isHome = !selectedCategory && !searchQuery.trim();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <main className="flex-1 p-6 space-y-8 overflow-auto">
            {isHome && (
              <>
                <HomeBanner />
                <CategoryGrid onSelectCategory={setSelectedCategory} />
                <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <h2 className="text-lg font-bold text-foreground mb-4 font-heading">최신 추가 도구</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
                    {allTools.slice(0, 4).map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isHome && (
              <div className="animate-fade-in-up">
                <h2 className="text-lg font-bold text-foreground mb-4 font-heading">
                  검색 결과
                  {filteredTools.length > 0 && (
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                      {filteredTools.length}개
                    </span>
                  )}
                </h2>
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
                    {filteredTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-12 text-center">
                    해당하는 도구가 없습니다.
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
