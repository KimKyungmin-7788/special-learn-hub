import { ExternalLink, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryById, type Tool } from "@/data/categories";
import CategoryIcon from "./CategoryIcon";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const cat = getCategoryById(tool.categoryId);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div
        className="h-36 flex items-center justify-center"
        style={{ backgroundColor: cat?.bgColor ?? "hsl(215,20%,95%)" }}
      >
        <CategoryIcon categoryId={tool.categoryId} size={64} />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-foreground text-lg leading-tight">{tool.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {cat && (
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: cat.bgColor, color: cat.color }}
            >
              {cat.name}
            </Badge>
          )}
          {tool.targetLevel.map((level) => (
            <Badge key={level} variant="outline" className="text-xs">
              {level}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-3">
          <Button size="sm" className="flex-1" asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              바로가기 <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
